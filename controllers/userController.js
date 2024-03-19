import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { errorHandler } from "../utils/error.js"

export const userRegister = async (req, res, next) => {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    try {
        const hashedPass = bcryptjs.hashSync(password, 10);
        if (!hashedPass) {
            throw new Error("Error hashing the password");
        }
        const newUser = new User({ name, email, password: hashedPass });
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    }
    catch (err) {
        next(err);
    }
}

export const userLogin = async (req, res, next) => {

    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email });

        if (!validUser) return next(errorHandler(404, "User Not found"))
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));

        const { password: pass, ...rest } = validUser._doc;
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        res.status(200).json({ rest, token });
    } catch (err) {
        next(err);
    }
}

