import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next)=> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Forbidden, Invalid token format' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if(decoded.userID) {
            req.userID = decoded.userID;
            next();
        }
        else {
            return res.status(403).json({ response: "Token does contain userID"})
        }
    } catch (error) {
        return res.status(403).json({response: "Incorrect token"});
    }
} 