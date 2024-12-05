import express, { response } from "express";
import { authMiddleware } from "../middleware.js";
import { Account, User } from "../db.js";
import mongoose from "mongoose";

const accountRoute = express.Router();

accountRoute.get('/balance', authMiddleware, async (req, res) => {
    try {
            const userID = req.userID;
            if(!userID) {
                return res.status(403).json({ response: "Invalid token"})
            }
            const user = await User.findOne({
                _id: req.userID,
            })
            const userAccount = await Account.findOne({
                userID: req.userID,
            });
            if(userAccount){
                return res.status(200).json({
                    userID: user._id,
                    user: user.firstName,
                    balance: userAccount.balance,
                });
            }
            else {
                return res.status(401).json( { response: "Invalid UserID" });
            }

    } catch (error) {
        return res.status(403).json({ response: "unable to connect to db" });
    }
});

accountRoute.post('/transfer', authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const { receiverID, amount } = req.body;
    try {
        const sender = await Account.findOne({ userID: req.userID });
        if(!sender) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ response : "User not found"})
        }
        if(sender.balance < amount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(201).json({ response: "Not have Enough balance"})
        }
        const receiver = await Account.findOne({ userID: receiverID });
        if(!receiver) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ response : "Receiver userID not found"})
        }
        const updateSender = await Account.findOneAndUpdate({
            userID: req.userID,
        },
        {
            $inc: { balance: - amount}, 
        },
        {
            new: true,
        }
        ).session(session);
        const updateReciver = await Account.findOneAndUpdate({
            userID: receiverID,
        },
        {
            $inc: { balance: amount }
        },
        {
            new: true,
        }
        ).session(session);
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({response : "Trasaction completed successfully"})
    } catch (error) {
        await session.abortTransaction();
        session.endSession();   
        console.log(error);
        return res.status(403).json({ response : "Unable to connect to server "});
    }

})

export default accountRoute;
