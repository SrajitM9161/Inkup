import multer from 'multer';

const storage =  multer.diskStorage({
  destination: (req, file, cb) => {     
    cb(null, './Public/temp'); // specify the directory to save uploaded files
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix); // create a unique filename
    }
  });

// Increase fieldSize to allow large text fields (e.g. projectData JSON) up to 10MB
const upload = multer({
  storage,
  limits: {
    // fieldSize is the maximum size (in bytes) for non-file fields
    fieldSize: 10 * 1024 * 1024, // 10 MB
  },
});

export default upload;
