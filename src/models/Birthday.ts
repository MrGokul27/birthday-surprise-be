import mongoose, { Schema, Document } from "mongoose";

export interface IBirthday extends Document {
    name?: string;
    age?: number;
    gender?: string;
    relationship?: string;
    dob?: string;
    email?: string;
    contact?: string;
    wish?: string;

    user: mongoose.Types.ObjectId;
    createdBy_name?: string;
    createdBy_email?: string;

    photos: {
        data: Buffer;
        contentType: string;
    }[];

    createdAt: Date;
}

const BirthdaySchema = new Schema<IBirthday>({
    name: String,
    age: Number,
    gender: String,
    relationship: String,
    dob: String,
    email: String,
    contact: String,

    photos: [
        {
            data: Buffer,
            contentType: String,
        },
    ],

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

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<IBirthday>("Birthday", BirthdaySchema);
