const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const FREELANCER_RESUME_PATH = path.join(process.env.FREELANCER_RESUME_PATH);
const USERS_BANNER_PATH = path.join(process.env.USERS_BANNER_PATH);
const COMPANY_LOGO_PATH = path.join(process.env.COMPANY_LOGO_PATH);
const COVER_IMAGE_PATH = path.join(process.env.COVER_IMAGE_PATH);
const PRODUCT_IMAGE_PATH = path.join(process.env.PRODUCT_IMAGE_PATH);
const PRODUCT_CSV_PATH = path.join(process.env.PRODUCT_CSV_PATH);
const CATEGORY_LOGO_PATH = path.join(process.env.CATEGORY_LOGO_PATH);
const SOCIAL_MEDIA_MASTER_PATH = path.join(process.env.SOCIAL_MEDIA_MASTER_PATH);
const CARD_IMAGE_PATH = path.join(process.env.CARD_IMAGE_PATH);
const REVIEW_IMAGE_PATH = path.join(process.env.REVIEW_IMAGE_PATH);

// //////////////################FREE LANCER RESUME################////////////////////////
const freelancerResume = multer.diskStorage({
  destination: function(req, file, cb) {
    const destinationPath = path.join(
        __dirname,
        '..',
        FREELANCER_RESUME_PATH,
    );
    // Check if the destination directory exists
    fs.access(destinationPath, fs.constants.F_OK, (err) => {
      if (err) {
        // If directory doesn't exist, create it
        fs.mkdir(destinationPath, { recursive: true }, (err) => {
          if (err) {
            console.error('Error creating directory:', err);
            cb(err, null);
          } else {
            cb(null, destinationPath);
          }
        });
      } else {
        cb(null, destinationPath);
      }
    });
  },
  filename: function(req, file, cb) {
    const uniqueFilename = `${Date.now()}${Math.random().toString().slice(15)}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});


const fileFilterResume = function(req, file, cb) {
  try {
    const allowedFileTypes = /pdf|docx|doc|word/;
    const mimetype = allowedFileTypes.test(file.mimetype);
    const extname = allowedFileTypes.test(
        path.extname(file.originalname).toLowerCase(),
    );

    if (mimetype && extname) {
      return cb(null, true);
    }

    const error = new Error('Only PDF,DOC,DOCX And WORD files are allowed!');
    error.status = 400; // Set the status code for the error

    cb(error);
  } catch (err) {
    console.log('error in fileFilter function', err.message);
  }
};


module.exports.uploadfreelanceResume = multer({
  storage: freelancerResume,
  fileFilter: fileFilterResume,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },
});

module.exports.handleMulterError = function(err, req, res, next) {
  if (err) {
    console.error('Multer error:', err.message);
    res.status(err.status || 400).json({ error: err.message });
  } else {
    next();
  }
};
// //////////////////###################END#########################///////////////////
// ############### Freelancer Banner Multer ################///
// Multer storage configuration for handling banner images uploads
const storageBannerImage = multer.diskStorage({
  destination: function(req, file, cb) {
    const destinationPath = path.join(__dirname, '..', USERS_BANNER_PATH);
    // Check if the destination directory exists
    fs.access(destinationPath, fs.constants.F_OK, (err) => {
      if (err) {
        // If directory doesn't exist, create it
        fs.mkdir(destinationPath, { recursive: true }, (err) => {
          if (err) {
            console.error('Error creating directory:', err);
            cb(err, null);
          } else {
            cb(null, destinationPath);
          }
        });
      } else {
        cb(null, destinationPath);
      }
    });
  },
  filename: function(req, file, cb) {
    const uniqueFilename = `${Date.now()}${Math.random().toString().slice(15)}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});
const fileFilterImage = function(req, file, cb) {
  try {
    const allowedFileTypes = /jpeg|jpg|png|gif|pdf|docx|doc|word/;
    const mimetype = allowedFileTypes.test(file.mimetype);
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }

    const error = new Error('Only JPEG, JPG, Gif, and PNG files are allowed!');
    error.status = 400; // Set the status code for the error

    cb(error);
  } catch (err) {
    console.log('error in fileFilter function', err.message);
  }
};

module.exports.uploadBannerImage= multer({
  storage: storageBannerImage,
  fileFilter: fileFilterImage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 1,
  },
});

// ####################################### Freelancer Banner Upload End #######################//
// ################################## Registration Multer - for Company Logo & Cover Image ##########
const storageCompanyLogo = multer.diskStorage({
  destination: function(req, file, cb) {
    const destinationPath = path.join(__dirname, '..', COMPANY_LOGO_PATH);
    // Check if the destination directory exists
    fs.access(destinationPath, fs.constants.F_OK, (err) => {
      if (err) {
        // If directory doesn't exist, create it
        fs.mkdir(destinationPath, { recursive: true }, (err) => {
          if (err) {
            console.error('Error creating directory:', err);
            cb(err, null);
          } else {
            cb(null, destinationPath);
          }
        });
      } else {
        cb(null, destinationPath);
      }
    });
  },
  filename: function(req, file, cb) {
    const uniqueFilename = `${Date.now()}${Math.random().toString().slice(15)}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const storageCoverImage = multer.diskStorage({
  destination: function(req, file, cb) {
    const destinationPath = path.join(__dirname, '..', COVER_IMAGE_PATH);
    // Check if the destination directory exists
    fs.access(destinationPath, fs.constants.F_OK, (err) => {
      if (err) {
        // If directory doesn't exist, create it
        fs.mkdir(destinationPath, { recursive: true }, (err) => {
          if (err) {
            console.error('Error creating directory:', err);
            cb(err, null);
          } else {
            cb(null, destinationPath);
          }
        });
      } else {
        cb(null, destinationPath);
      }
    });
  },
  filename: function(req, file, cb) {
    const uniqueFilename = `${Date.now()}${Math.random().toString().slice(15)}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});
const fileFilterImageReg = function(req, file, cb) {
  try {
    const allowedFileTypes = /jpeg|jpg|png/;
    const mimetype = allowedFileTypes.test(file.mimetype);
    const extname = allowedFileTypes.test(
        path.extname(file.originalname).toLowerCase(),
    );

    if (mimetype && extname) {
      return cb(null, true);
    }

    const error = new Error('Only JPEG, JPG, and PNG files are allowed!');
    error.status = 400; // Set the status code for the error

    cb(error);
  } catch (err) {
    console.log('error in fileFilter function', err.message);
  }
};
module.exports.uploadCoverImages = multer({
  storage: storageCoverImage,
  fileFilter: fileFilterImageReg,
  limits: {
    fileSize: 1024 * 1024, // 1MB
  },
});
module.exports.uploadCompanyLogo = multer({
  storage: storageCompanyLogo,
  fileFilter: fileFilterImageReg,
  limits: {
    fileSize: 1024 * 1024, // 1MB
  },
});
// ####################################### Cover Image and Company Logo End #######################//
// #################### Products Images and CSV Multer #########################/////////
const storageImage = multer.diskStorage({
  destination: function(req, file, cb) {
    const destinationPath = path.join(__dirname, '..', PRODUCT_IMAGE_PATH);
    // Check if the destination directory exists
    fs.access(destinationPath, fs.constants.F_OK, (err) => {
      if (err) {
        // If directory doesn't exist, create it
        fs.mkdir(destinationPath, { recursive: true }, (err) => {
          if (err) {
            console.error('Error creating directory:', err);
            cb(err, null);
          } else {
            cb(null, destinationPath);
          }
        });
      } else {
        cb(null, destinationPath);
      }
    });
  },
  filename: function(req, file, cb) {
    const uniqueFilename = `${Date.now()}${Math.random().toString().slice(15)}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const storageCsv = multer.diskStorage({
  destination: function(req, file, cb) {
    const destinationPath = path.join(__dirname, '..', PRODUCT_CSV_PATH);
    // Check if the destination directory exists
    fs.access(destinationPath, fs.constants.F_OK, (err) => {
      if (err) {
        // If directory doesn't exist, create it
        fs.mkdir(destinationPath, { recursive: true }, (err) => {
          if (err) {
            console.error('Error creating directory:', err);
            cb(err, null);
          } else {
            cb(null, destinationPath);
          }
        });
      } else {
        cb(null, destinationPath);
      }
    });
  },
  filename: function(req, file, cb) {
    const uniqueFilename = `${Date.now()}${Math.random().toString().slice(15)}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const fileFilter2 = function(req, file, cb) {
  try {
    const allowedFileTypes = /jpeg|jpg|png/;
    const mimetype = allowedFileTypes.test(file.mimetype);
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }

    const error = new Error('Only JPEG, JPG, and PNG files are allowed!');
    error.status = 400; // Set the status code for the error

    cb(error);
  } catch (err) {
    console.log('error in fileFilter function', err.message);
  }
};

const fileFilter = function(req, file, cb) {
  try {
    const allowedFileTypes = /csv/;
    const mimetype = allowedFileTypes.test(file.mimetype);
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }

    const error = new Error('Only CSV files are allowed!');
    error.status = 400; // Set the status code for the error

    cb(error);
  } catch (err) {
    console.log('error in fileFilter function', err.message);
  }
};

module.exports.uploadCsv = multer({
  storage: storageCsv,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024, // 1MB
  },
});
module.exports.uploadImages = multer({
  storage: storageImage,
  fileFilter: fileFilter2,
  limits: {
    fileSize: 1024 * 1024, // 1MB
  },
});

// #################### Products Images and CSV Multer End #########################/////////
// ######################### Category logo and Banner Image ###############/////////////
const storageCategory = multer.diskStorage({
  destination: function(req, file, cb) {
    const destinationPath = path.join(__dirname, '..', CATEGORY_LOGO_PATH);
    // Check if the destination directory exists
    fs.access(destinationPath, fs.constants.F_OK, (err) => {
      if (err) {
        // If directory doesn't exist, create it
        fs.mkdir(destinationPath, { recursive: true }, (err) => {
          if (err) {
            console.error('Error creating directory:', err);
            cb(err, null);
          } else {
            cb(null, destinationPath);
          }
        });
      } else {
        cb(null, destinationPath);
      }
    });
  },
  filename: function(req, file, cb) {
    const uniqueFilename = `${Date.now()}${Math.random().toString().slice(15)}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});
const fileFilterCategory = function(req, file, cb) {
  try {
    const allowedFileTypes = /jpeg|jpg|png|svg/;
    const mimetype = allowedFileTypes.test(file.mimetype);
    const extname = allowedFileTypes.test(
        path.extname(file.originalname).toLowerCase(),
    );

    if (mimetype && extname) {
      return cb(null, true);
    }

    const error = new Error('Only JPEG, JPG, and PNG files are allowed!');
    error.status = 400; // Set the status code for the error

    cb(error);
  } catch (err) {
    console.log('error in fileFilter function', err.message);
  }
};
module.exports.upload = multer({
  storage: storageCategory,
  fileFilter: fileFilterCategory,
  limits: {
    fileSize: 2* 1024 * 1024, // 2MB
  },
});

// ////##################### Category logo and Banner Image End ##############/////////

// ############ multer for social media master #################////
const storageSocialImage = multer.diskStorage({
  destination: function(req, file, cb) {
    const destinationPath = path.join(__dirname, '..', SOCIAL_MEDIA_MASTER_PATH);
    // Check if the destination directory exists
    fs.access(destinationPath, fs.constants.F_OK, (err) => {
      if (err) {
        // If directory doesn't exist, create it
        fs.mkdir(destinationPath, { recursive: true }, (err) => {
          if (err) {
            console.error('Error creating directory:', err);
            cb(err, null);
          } else {
            cb(null, destinationPath);
          }
        });
      } else {
        cb(null, destinationPath);
      }
    });
  },
  filename: function(req, file, cb) {
    const uniqueFilename = `${Date.now()}${Math.random().toString().slice(15)}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});
const fileFilterImageSocial = function(req, file, cb) {
  try {
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const mimetype = allowedFileTypes.test(file.mimetype);
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }

    const error = new Error('Only JPEG, JPG, and PNG files are allowed!');
    error.status = 400; // Set the status code for the error

    cb(error);
  } catch (err) {
    console.log('error in fileFilter function', err.message);
  }
};

module.exports.uploadSocialImage= multer({
  storage: storageSocialImage,
  fileFilter: fileFilterImageSocial,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 1,
  },
});

//################################ CARD IMAGE UPLOAD ###################################//

const cardImageUpload = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.join(
      __dirname,
      "..",
      CARD_IMAGE_PATH
    );
    // Check if the destination directory exists
    fs.access(destinationPath, fs.constants.F_OK, (err) => {
      if (err) {
        // If directory doesn't exist, create it
        fs.mkdir(destinationPath, { recursive: true }, (err) => {
          if (err) {
            console.error("Error creating directory:", err);
            cb(err, null);
          } else {
            cb(null, destinationPath);
          }
        });
      } else {
        cb(null, destinationPath);
      }
    });
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${Date.now()}${Math.random()
      .toString()
      .slice(15)}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});
const filterCardImage = function (req, file, cb) {
  try {
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const mimetype = allowedFileTypes.test(file.mimetype);
    const extname = allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }

    const error = new Error("Only JPEG, JPG, Gif, and PNG files are allowed!");
    error.status = 400; // Set the status code for the error

    cb(error);
  } catch (err) {
    console.log("error in fileFilter function", err.message);
  }
};

module.exports.uploadCardImage = multer({
  storage: cardImageUpload,
  fileFilter: filterCardImage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 1,
  },
});


//################################ RIVIEW IMAGE UPLOAD ###################################//

const ReviewImageUpload = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.join(
      __dirname,
      "..",
      REVIEW_IMAGE_PATH
    );
    // Check if the destination directory exists
    fs.access(destinationPath, fs.constants.F_OK, (err) => {
      if (err) {
        // If directory doesn't exist, create it
        fs.mkdir(destinationPath, { recursive: true }, (err) => {
          if (err) {
            console.error("Error creating directory:", err);
            cb(err, null);
          } else {
            cb(null, destinationPath);
          }
        });
      } else {
        cb(null, destinationPath);
      }
    });
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${Date.now()}${Math.random()
      .toString()
      .slice(15)}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});
const filterReviewImage = function (req, file, cb) {
  try {
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const mimetype = allowedFileTypes.test(file.mimetype);
    const extname = allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }

    const error = new Error("Only JPEG, JPG, Gif, and PNG files are allowed!");
    error.status = 400; // Set the status code for the error

    cb(error);
  } catch (err) {
    console.log("error in fileFilter function", err.message);
  }
};

module.exports.uploadReviewImage = multer({
  storage: ReviewImageUpload,
  fileFilter: filterReviewImage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 1,
  },
});
