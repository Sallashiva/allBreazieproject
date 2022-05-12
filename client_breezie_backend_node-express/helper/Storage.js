const multer = require('multer');

const diskStorage = multer.memoryStorage({
    destination: function (req, file, cb) {
      cb(null, '')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }    
});

const filefilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true)
  } else {
      cb(null, false)
  }
}

const storage = multer({ storage: diskStorage , fileFilter: filefilter }).single('imagePath');

module.exports = storage;