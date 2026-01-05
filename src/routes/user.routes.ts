import express from "express";
import User from "../models/User";
import { protect } from "../middleware/auth";

const router = express.Router();

router.get("/count", protect, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    const count = await User.countDocuments();
    res.json({ count });
});

export default router;
