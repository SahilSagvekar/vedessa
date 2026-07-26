const prisma = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new vendor
exports.registerVendor = async (req, res) => {
    try {
        const {
            email,
            password,
            fullName,
            companyName,
            gstNumber,
            phone,
            address,
            city,
            state,
            pincode,
            bankDetails
        } = req.body;

        if (!email || !password || !fullName || !companyName || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const vendor = await prisma.user.create({
            data: {
                email,
                passwordHash,
                fullName,
                role: 'VENDOR',
                companyName,
                gstNumber,
                phone,
                address,
                city,
                state,
                pincode,
                bankDetails: bankDetails ? JSON.stringify(bankDetails) : null,
                isApproved: false // Requires admin approval
            }
        });

        const token = jwt.sign(
            { id: vendor.id, role: vendor.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        const { passwordHash: _, ...vendorData } = vendor;

        res.status(201).json({
            success: true,
            message: 'Vendor registration successful. Your account is pending approval.',
            data: {
                user: vendorData,
                token
            }
        });
    } catch (error) {
        console.error('Vendor registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to register vendor',
            error: error.message
        });
    }
};
