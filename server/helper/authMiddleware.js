const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ status: false, msg: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET_KEY);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ status: false, msg: "Invalid token." });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ status: false, msg: "Invalid token." });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ status: false, msg: "Access denied. Please login first." });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ status: false, msg: "Access denied. Admin privileges required." });
        }

        next();
    } catch (error) {
        return res.status(500).json({ status: false, msg: "Something went wrong." });
    }
};

const isCustomer = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ status: false, msg: "Access denied. Please login first." });
        }

        if (req.user.role !== 'customer') {
            return res.status(403).json({ status: false, msg: "Access denied. Customer privileges required." });
        }

        next();
    } catch (error) {
        return res.status(500).json({ status: false, msg: "Something went wrong." });
    }
};

module.exports = {
    verifyToken,
    isAdmin,
    isCustomer
};
