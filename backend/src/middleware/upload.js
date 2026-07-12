const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
console.log('--- Configuring Cloudinary Middleware ---');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage - routes each file to the right resource_type
// (image vs video) based on its mimetype, since a single field now accepts both.
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith('video/');
        return {
            folder: 'vedessa/products',
            resource_type: isVideo ? 'video' : 'image',
            allowed_formats: isVideo
                ? ['mp4', 'mov', 'webm']
                : ['jpg', 'png', 'jpeg', 'webp', 'svg'],
            public_id: `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}`
        };
    }
});

// File filter - accept images and videos
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image or video files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 25 * 1024 * 1024 // 25MB limit (covers short video clips)
    },
    fileFilter: fileFilter
});

module.exports = upload;
