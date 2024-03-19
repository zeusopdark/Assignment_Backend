import { errorHandler } from "./error.js"
import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization || req.headers.Authorization;
    if (!token || !token.startsWith('Bearer')) {
        return next(errorHandler(498, "Please Login token is not included"))
    }
    const tokenString = token.split(" ")[1];
    try {
        const decodedData = jwt.verify(tokenString, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);
        next();
    } catch (err) {
        return next(errorHandler(403, "Forbidden"))
    }

}
export default verifyToken;