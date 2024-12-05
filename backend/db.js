import mongoose, { Schema } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.url);


const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    username: {type: String, required: true, unique: true, trim: true, minLength: 6, maxLength: 26},
    password: {type: String, required: true, minLength: 8}
});

const accountSchema = new mongoose.Schema({
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true},
    balance: { type: Number, required: true},
});

export const Account = mongoose.model("Account", accountSchema);
export const User = mongoose.model("User", userSchema);

