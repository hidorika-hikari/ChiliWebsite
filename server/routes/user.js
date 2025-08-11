const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('../models/user');

const cloudinary = require('cloudinary').v2;
const pLimit = require('p-limit');

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
});

router.post('/signup', async (req, res) => {
    const { name, phone, email, password, role = 'customer' } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        const existingByPhone = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ status: false, msg: "User already exists!" });
        }
        if (existingByPhone) {
            return res.status(400).json({ status: false, msg: "Phone number is already registered!" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const result = await User.create({
            name: name,
            phone: phone,
            email: email,
            password: hashPassword,
            role: role
        });

        const token = jwt.sign(
            { email: result.email, id: result._id, role: result.role },
            process.env.JSON_WEB_TOKEN_SECRET_KEY
        );

        res.status(200).json({
            status: true,
            user: result,
            token: token
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ status: false, msg: "Something went wrong" });
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ status: false, msg: "User not found!" });
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(400).json({ status: false, msg: "invalid password" });
        }

        const token = jwt.sign(
            { email: existingUser.email, id: existingUser._id, role: existingUser.role },
            process.env.JSON_WEB_TOKEN_SECRET_KEY
        );

        res.status(200).json({
            status: true,
            user: existingUser,
            token: token,
            msg: "User authenticated"
        });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ status: false, msg: "Something went wrong" });
    }
});

router.post('/admin/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ status: false, msg: "User not found!" });
        }

        // Check if user is admin
        if (existingUser.role !== 'admin') {
            return res.status(403).json({ status: false, msg: "Access denied. Admin privileges required." });
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(400).json({ status: false, msg: "Invalid password" });
        }

        const token = jwt.sign(
            { email: existingUser.email, id: existingUser._id, role: existingUser.role },
            process.env.JSON_WEB_TOKEN_SECRET_KEY
        );

        res.status(200).json({
            status: true,
            user: existingUser,
            token: token,
            msg: "Admin authenticated successfully"
        });
    } catch (error) {
        console.error('Admin signin error:', error);
        res.status(500).json({ status: false, msg: "Something went wrong" });
    }
});

router.get('/get/count', async (req, res) => {
    try {
        const userCount = await User.countDocuments({});
        res.status(200).json({ userCount });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const userList = await User.find();
        if (!userList) {
            return res.status(500).json({ success: false });
        }
        res.send(userList);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User with the given ID wasn't found" });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).json({ message: "Invalid user ID", error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const userExist = await User.findById(req.params.id);
        if (!userExist) {
            return res.status(404).json({ status: false, msg: "User not found" });
        }

        // Prepare images array
        let images = [];
        if (Array.isArray(req.body.images)) {
            images = req.body.images;
        } else if (typeof req.body.images === 'string' && req.body.images.trim() !== '') {
            images = [req.body.images];
        }

        // Upload new images if any
        let imgurl = [];
        if (images.length > 0) {
            const limit = pLimit(2);
            const imagesToUpload = images.map((image) =>
                limit(async () => {
                    const result = await cloudinary.uploader.upload(image);
                    return result;
                })
            );
            const uploadStatus = await Promise.all(imagesToUpload);
            imgurl = uploadStatus.map((item) => item.secure_url);
        } else {
            console.log("No images to upload, using existing images");
            imgurl = userExist.images || [];
        }

        const { name, phone, email, password } = req.body;

        const updatedData = {
            name: name ?? userExist.name,
            phone: phone ?? userExist.phone,
            email: email ?? userExist.email,
            password: password ? await bcrypt.hash(password, 10) : userExist.password,
            images: imgurl.length > 0 ? imgurl : userExist.images,
        };

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ status: false, msg: "Failed to update user" });
        }

        res.status(200).json({
            status: true,
            msg: "User updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ status: false, msg: "Something went wrong", error: error.message });
    }
});

router.put('/:id/change-password', async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.params.id;

    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ status: false, msg: "All fields are required" });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ status: false, msg: "New passwords do not match" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ status: false, msg: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: false, msg: "Old password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ status: true, msg: "Password updated successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ status: false, msg: "Something went wrong" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) {
            return res.status(200).json({ success: true, message: "User deleted!" });
        } else {
            return res.status(404).json({ success: false, message: "User not found!" });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;