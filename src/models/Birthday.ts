import mongoose from "mongoose";

const BirthdaySchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    relationship: String,
    dob: String,
    email: String,
    contact: String,
    image: {
        data: Buffer,
        contentType: String,
    },
    wish: {
        type: String,
        default: "",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdBy_name: String,
    createdBy_email: String,
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Birthday", BirthdaySchema);
