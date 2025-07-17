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

const upload = multer({ storage });

export default upload;
