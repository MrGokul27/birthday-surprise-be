import express from "express";
import User from "../models/User";
import { protect } from "../middleware/auth";

const router = express.Router();

router.get("/count", protect, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    const count = await User.countDocuments();
    res.json({ count });
});

router.get("/me", protect, async (req: any, res) => {
    res.json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
    });
});

export default router;
