import mongoose from "mongoose";
const attendanceSchema = new mongoose.Schema({
    personId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;