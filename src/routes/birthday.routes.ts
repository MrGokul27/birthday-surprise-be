import express from "express";
import Birthday from "../models/Birthday";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/", protect, async (req: any, res) => {
    try {
        const birthday = await Birthday.create({
            ...req.body,
            user: req.user.id,
            createdBy_name: req.user.name,
            createdBy_email: req.user.email,
        });
        res.status(201).json(birthday);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/", protect, async (req: any, res) => {
    try {
        let birthdays;
        if (req.user.role === "admin") {
            birthdays = await Birthday.find();
        } else {
            birthdays = await Birthday.find({ user: req.user.id });
        } res.json(birthdays);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;