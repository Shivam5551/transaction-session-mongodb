import express, { response } from "express";
import { Account, User } from "../db.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import zod from 'zod';
import { authMiddleware } from "../middleware.js";

const userRoute = express.Router();
const JWT_SECRET = process.env.JWT_SECRET

const singinSchema = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string().optional(),
    password: zod.string().min(8),
});

const loginSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(8),
});

const updateSchema = zod.object({
    username: zod.string().optional(),
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})



const saltRounds = 15;

const hashPass = async (password)=> {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword;
    } catch (error) {
       console.log(`Error while hasing ${error}`);
       throw error; 
    }
}

const comparePassword = async (enteredPassword, storedPassword) => {
    return await bcrypt.compare(enteredPassword, storedPassword);
};

const generateToken = (id) => {
    return jwt.sign({ userID: id}, JWT_SECRET);
}

userRoute.post('/signup', async (req, res) => {
    const { success } = singinSchema.safeParse(req.body);
    if(!success) {
        return res.status(411).json({ response: "Incorrect inputs"})
    }
    const { firstName, lastName, username, password} = req.body;
    try {
        const existingUser = await User.findOne({
            username: username,
        })
        if(existingUser) {
            return res.status(409).json({ response: "User already exists"});
        }
        else {
            const hashedPassword = await hashPass(password);
            const user = await User.create({
                firstName: firstName,
                lastName: lastName,
                username: username,
                password: hashedPassword,
            });
            if(user) {
                const jwtToken = generateToken(user._id);
                var message = "Initial amount has not credited yet!"
                const initialAmount = await Account.create({
                    userID: user._id,
                    balance: Math.floor((Math.random() * 10000))
                });
                if(initialAmount) {
                    message = "Initial amount has been credited!"
                }
                return res.status(200).json(
                    { 
                        response: `Your userID is ${user._id}`,
                        token: jwtToken,
                        message: message,
                    }
                );
            }
            else throw new Error("Unable to connect to database");
        }
    } catch (error) {
        console.log(error);
        return res.json({ response: error});
    }
});

userRoute.post('/signin', async (req, res) => {
    const { success } = loginSchema.safeParse(req.body);
    if(!success) {
        return res.status(411).json({ response: "Invalid inputs"});
    }
    const { username, password} = req.body;
    try {
        User.findOne({
            username: username,
        }).then(async (user)=> {
            if(user) {
                const isValidPassword = await comparePassword(password, user.password);
                if(!isValidPassword) {
                    if (!isPasswordValid) {
                        return res.status(401).json({ response: "Invalid password" });
                    }
                }
                const jwtToken = generateToken(user._id);
                return res.json(
                    {
                        token: jwtToken,
                    }
                );
            }
            else {
                console.log(user);
                return res.status(401).json({ response: "Error while logging in"});
            }
        })
    } catch (error) {
        return res.json({ response: error});
    }
})

userRoute.put('/update', authMiddleware, async (req, res) => {
    const { success } = updateSchema.safeParse(req.body);
    if(!success) {
        return res.status(411).json({ response: "Incorrect inputs"})
    }
    try {
        if(req.body.password) {
            const hashedPassword = await hashPass(req.body.password);
            req.body.password = hashedPassword;
        }
        if(!req.userID) {
            return res.status(403).json({ response: "Invalid User"})
        }
        const user = await User.updateOne(
            {
                _id: req.userID,
            }, 
            req.body,
        );
        if(user) {
            const jwtToken = generateToken(user._id);
            return res.json(
                { 
                    response: "Updated successfully",
                    token: jwtToken 
                }
            );
        }
        else {
            throw new Error("User not found");
        }
    } catch (error) {
        return res.json({ response: error});
    }   
});

userRoute.get('/bulk', async (req, res) => {
    const filter = req.query.filter || '';
    try {
        const users = await User.find({
            $or: [
                {
                    firstName: {
                        '$regex': filter,
                    }
                },
                {
                    lastName: {
                        '$regex': filter,
                    }
                }
            ]
        });
        if(users) {
            return res.json({
                    user: users.map(user => ({
                        username: user.username, 
                        firstName: user.firstName,
                        lastName: user.lastName,
                        userId: user._id,
                    }))
            })
        };
    } catch (error) {
        return res.status(500).json({ error })
    }
})




export default userRoute;