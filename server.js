import dotenv from "dotenv"
dotenv.config();
import express from "express"
import cors from "cors"
import mongoose from "mongoose";
import Attendance from "./models/attendance.model.js";
import verifyToken from "./utils/verifyUser.js";
import userRouter from "./routes/user.routes.js"
import cookieParser from "cookie-parser"
import User from "./models/user.model.js";
const app = express();
const corsOptions = {
    origin: ["https://assignment-frontend-8373.onrender.com", "http://localhost:3000"],
    credentials: true,
}
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userRouter);

//to get all the attendence record
app.get('/attendance', verifyToken, async (req, res, next) => {
    try {
        const attendanceRecords = await Attendance.find().populate('personId', 'name');
        const formattedAttendanceRecords = attendanceRecords.map(record => ({
            date: record.date,
            personId: record.personId._id,
            name: record.personId.name
        }));
        console.log(formattedAttendanceRecords);
        res.status(200).json(formattedAttendanceRecords);
    } catch (error) {
        next(error);
    }
});

//Marking the attendance
app.post('/attendance', verifyToken, async (req, res, next) => {
    try {
        const { personId } = req.body;
        if (!personId) {
            return res.status(400).json({ error: 'Student ID is required' });
        }
        const foundUser = User.findOne(personId)
        if (!foundUser) {
            res.status(404).json({ success: false, message: "User Not Found" });
        }
        const attendance = new Attendance({ personId });
        await attendance.save();
        res.status(201).json({ message: 'Attendance marked successfully' });
    } catch (error) {
        next(error);
    }
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error'
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    })
})


mongoose.connect(process.env.MONGO_URL);
mongoose.connection.once("open", () => {
    app.listen(process.env.PORT, () => {
        console.log(`Connected to mongoDB listening on port ${process.env.PORT}`);
    })
})

mongoose.connection.on("error", (err) => {
    console.log("Erorr" + err)
})

