const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); // Store files in memory (for uploading to Backblaze)

// File type validation
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown',
    ];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Invalid file type. Only PDF, Word, TXT, or MD files are allowed.'), false);
    }
};

// Configure Multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB file size limit
    },
});

module.exports = upload;
