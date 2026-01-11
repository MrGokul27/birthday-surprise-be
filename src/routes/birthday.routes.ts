import express from "express";
import Birthday from "../models/Birthday";
import { protect } from "../middleware/auth";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

/* CREATE */
router.post("/", protect, async (req: any, res) => {
    try {
        const birthday = await Birthday.create({
            ...req.body,
            user: req.user.id,
            createdBy_name: req.user.name,
            createdBy_email: req.user.email,
        });
        res.status(201).json(birthday);
    } catch {
        res.status(500).json({ message: "Server Error" });
    }
});

/* FETCH */
router.get("/", protect, async (req: any, res) => {
    try {
        const birthdays =
            req.user.role === "admin"
                ? await Birthday.find()
                : await Birthday.find({ user: req.user.id });

        res.json(birthdays);
    } catch {
        res.status(500).json({ message: "Server Error" });
    }
});

/* UPDATE */
router.put("/:id", protect, async (req: any, res) => {
    try {
        const birthday = await Birthday.findById(req.params.id);

        if (!birthday) {
            return res.status(404).json({ message: "Birthday not found" });
        }

        // Ownership check
        if (
            req.user.role !== "admin" &&
            birthday.user.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updatedBirthday = await Birthday.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedBirthday);
    } catch {
        res.status(500).json({ message: "Server Error" });
    }
});

/* DELETE */
router.delete("/:id", protect, async (req: any, res) => {
    try {
        const birthday = await Birthday.findById(req.params.id);

        if (!birthday) {
            return res.status(404).json({ message: "Birthday not found" });
        }

        // Ownership check
        if (
            req.user.role !== "admin" &&
            birthday.user.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await birthday.deleteOne();

        res.json({ message: "Birthday deleted successfully" });
    } catch {
        res.status(500).json({ message: "Server Error" });
    }
});

/* ✍️ UPDATE BIRTHDAY WISH */
router.patch("/:id/wish", protect, async (req: any, res) => {
    try {
        const { wish } = req.body;

        const birthday = await Birthday.findById(req.params.id);

        if (!birthday) {
            return res.status(404).json({ message: "Birthday not found" });
        }

        // Ownership check
        if (
            req.user.role !== "admin" &&
            birthday.user.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        birthday.wish = wish;
        await birthday.save();

        res.json(birthday);
    } catch {
        res.status(500).json({ message: "Server Error" });
    }
});

/* 📸 UPLOAD IMAGE */
router.patch(
    "/:id/image",
    protect,
    upload.single("image"),
    async (req: any, res) => {
        try {
            const birthday = await Birthday.findById(req.params.id);

            if (!birthday) {
                return res.status(404).json({ message: "Birthday not found" });
            }

            if (
                req.user.role !== "admin" &&
                birthday.user.toString() !== req.user.id
            ) {
                return res.status(403).json({ message: "Not authorized" });
            }

            birthday.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };

            await birthday.save();
            res.json({ message: "Image uploaded successfully" });
        } catch {
            res.status(500).json({ message: "Server Error" });
        }
    }
);

/* 📸 GET IMAGE */
router.get("/:id/image", async (req, res) => {
    const birthday = await Birthday.findById(req.params.id);

    if (!birthday || !birthday.image?.data) {
        return res.status(404).json({ message: "Image not found" });
    }

    res.set("Content-Type", birthday.image.contentType || "image/jpeg");
    res.send(birthday.image.data);
});

export default router;
