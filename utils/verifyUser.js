import { errorHandler } from "./error.js"
import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization || req.headers.Authorization;
    const check = token.split(" ")[0];
    if (!token || check !== 'Bearer') {
        return next(errorHandler(498, "Please login, token is not included"));
    }
    try {
        const actualToken = token.split(" ")[1];
        const decodedData = jwt.verify(actualToken, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);
        next();
    } catch (err) {
        return next(errorHandler(403, "Forbidden"));
    }
};

export default verifyToken;
