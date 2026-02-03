const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

/**
 * Submit collaboration request
 * POST /api/contact/collaboration
 */
router.post('/collaboration', async (req, res) => {
    try {
        const { fullName, email, phone, message } = req.body;

        // Validate required fields
        if (!fullName || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Full name, email, and message are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Send email to admin
        const result = await emailService.sendCollaborationEmail({
            fullName,
            email,
            phone,
            message
        });

        if (result.success) {
            res.json({
                success: true,
                message: 'Collaboration request submitted successfully. We will get back to you soon!'
            });
        } else {
            throw new Error(result.error);
        }

    } catch (error) {
        console.error('Collaboration request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit collaboration request. Please try again later.'
        });
    }
});

/**
 * Submit support request
 * POST /api/contact/support
 */
router.post('/support', async (req, res) => {
    try {
        const { fullName, email, phone, concern } = req.body;

        // Validate required fields
        if (!fullName || !email || !concern) {
            return res.status(400).json({
                success: false,
                message: 'Full name, email, and concern are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Send email to admin
        const result = await emailService.sendSupportEmail({
            fullName,
            email,
            phone,
            concern
        });

        if (result.success) {
            res.json({
                success: true,
                message: 'Support request submitted successfully. Our team will contact you soon!'
            });
        } else {
            throw new Error(result.error);
        }

    } catch (error) {
        console.error('Support request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit support request. Please try again later.'
        });
    }
});

module.exports = router;
