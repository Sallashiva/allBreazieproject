const multer = require('multer');

const diskStorage = multer.memoryStorage({
    destination: function (req, file, cb) {
      cb(null, './images/brand')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }    
});

const welcomediskStorage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, '.images/welcomScreen')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }    
});

const cateringdiskStorage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, './images/catering')
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

const storage = multer({ storage: diskStorage , fileFilter: filefilter }).single('companyLogo');
const storage1 = multer({ storage: welcomediskStorage , fileFilter: filefilter }).single('image');
const cateringStorage = multer({ storage: cateringdiskStorage , fileFilter: filefilter }).single('imagePath');

module.exports = {storage,storage1,cateringStorage}