const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('../models/user');

router.post('/signup', async (req, res) => {
    const { name, phone, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email: email });
        if(existingUser) {
            return res.status(400).json({ msg: "User already exist!" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const result = await User.create({
            name: name,
            phone: phone,
            email: email,
            password: hashPassword,
        });

        const token = jwt.sign(
            { email: result.email, id: result._id },
            process.env.JSON_WEB_TOKEN_SECRET_KEY
        );

        res.status(200).json({
            user: result,
            token: token
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ msg: "Something went wrong" });
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(400).json({ msg: "User not found!" });
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign(
            { email: existingUser.email, id: existingUser._id },
            process.env.JSON_WEB_TOKEN_SECRET_KEY
        );

        res.status(200).json({
            user: existingUser,
            token: token,
            msg: "User authenticated"
        });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ msg: "Something went wrong" });
    }
});

router.get('/', async (req, res) =>{
    const userList = await User.find();
    if (!userList) {
        res.status(500).json({ success: false })
    }
    res.send(userList);
})

router.get('/:id', async (req, res) =>{
    const userList = await User.findById(req.params.id);
    if (!userList) {
        res.status(500).json({ message: "The user with the given ID was not found" })
        return;
    }
    res.status(200).send(userList);
})

router.delete('/:id', async (req, res) =>{
    User.findByIdAndDelete(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({ success: true, message: "The user is deleted!" })
        } else {
            return res.status(404).json({ success: false, message: "User not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
})

router.get('/get/count', async (req, res) => {
    try {
        const userCount = await User.countDocuments({});
        res.status(200).send({
            userCount: userCount
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    const { name, phone, email, password } = req.body;

    try {
        const userExist = await User.findById(req.params.id);
        if (!userExist) {
            return res.status(404).json({ msg: "User not found" });
        }

        let newPassword;
        if (password) {
            newPassword = await bcrypt.hash(password, 10);
        } else {
            newPassword = userExist.password;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                name,
                phone,
                email,
                password: newPassword
            },
            { new: true }
        );

        res.status(200).json({
            msg: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ msg: "Something went wrong", error: error.message });
    }
});

module.exports = router;