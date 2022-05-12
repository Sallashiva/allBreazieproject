const multer = require('multer');

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './pdf/agreement');
    },
    filename: (req, file, cb) => {
        const mimeType = file.mimetype.split('/');
        const fileType = mimeType[1];
        const fileName = file.originalname;
        cb(null, fileName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['application/pdf'];
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);

};

const storage = multer({
    storage: diskStorage,
    limits: {
        fieldSize: 25 * 1024 * 1024
    },
    fileFilter: fileFilter
}).single(
    'pdf'
);

module.exports = storage;