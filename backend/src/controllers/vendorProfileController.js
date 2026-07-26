const prisma = require('../config/database');

const PROFILE_SELECT = {
    id: true,
    email: true,
    fullName: true,
    companyName: true,
    gstNumber: true,
    phone: true,
    address: true,
    city: true,
    state: true,
    pincode: true,
    bankDetails: true,
    isApproved: true,
    role: true,
    createdAt: true,
    updatedAt: true
};

// Get vendor profile
exports.getMyProfile = async (req, res) => {
    try {
        const vendor = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: PROFILE_SELECT
        });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        res.json({
            success: true,
            data: vendor
        });
    } catch (error) {
        console.error('Get vendor profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendor profile',
            error: error.message
        });
    }
};

// Update vendor profile
exports.updateMyProfile = async (req, res) => {
    try {
        const {
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

        const updateData = {};
        if (fullName) updateData.fullName = fullName;
        if (companyName) updateData.companyName = companyName;
        if (gstNumber) updateData.gstNumber = gstNumber;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;
        if (city) updateData.city = city;
        if (state) updateData.state = state;
        if (pincode) updateData.pincode = pincode;
        if (bankDetails) updateData.bankDetails = JSON.stringify(bankDetails);

        const vendor = await prisma.user.update({
            where: { id: req.user.id },
            data: updateData,
            select: PROFILE_SELECT
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: vendor
        });
    } catch (error) {
        console.error('Update vendor profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update vendor profile',
            error: error.message
        });
    }
};
