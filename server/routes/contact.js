const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/contactMessage');

router.post('/add', async (req, res) => {
    try {
        const { name, email, message } = req.body || {};

        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ success: false, message: 'Email is not valid' });
        }
        if (!message || !message.trim()) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        const contact = new ContactMessage({ name: name.trim(), email: email.trim().toLowerCase(), message: message.trim() });
        const saved = await contact.save();

        return res.status(201).json({ success: true, data: saved });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// GET list of contact messages with pagination
router.get('/', async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page || '1', 10), 1);
        const perPage = Math.min(Math.max(parseInt(req.query.perPage || '10', 10), 1), 50);

        const [total, messages] = await Promise.all([
            ContactMessage.countDocuments(),
            ContactMessage.find().sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage)
        ]);

        return res.status(200).json({
            success: true,
            total,
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
            messages
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// PATCH update status of a contact message
router.patch('/:id', async (req, res) => {
    try {
        const { status } = req.body || {};
        const allowed = ['new', 'read', 'archived'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        const updated = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// DELETE a contact message
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        return res.status(200).json({ success: true, message: 'Message deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;