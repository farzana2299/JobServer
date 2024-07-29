const multer = require('multer');
const path = require('path');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './resumes'); // Destination directory for uploaded files
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // File naming strategy
//   },
// });
//storage
const storage=multer.diskStorage({
  destination:(req,file,callback)=>{

      callback(null,'./resumes')
  },
  filename:(req,file,callback)=>{
      callback(null,`file-${Date.now()}-${file.originalname}`)
  }
})
// // Define a file filter function to accept only PDF files
// const fileFilter = (req, file, cb) => {
//   const allowedMimeTypes = ['application/pdf'];

//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true); // Accept the file
//   } else {
//     cb(new Error('Only PDF files are allowed'), false); // Reject the file
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5000000, files: 1 },
//   fileFilter: fileFilter, // Use the file filter
// });

// const errorMulter = (error, req, res, next) => {
//   if (error instanceof multer.MulterError) {
//     if (error.code == "LIMIT_FILE_SIZE") {
//       return res.status(400).json({
//         message: "File Should be less than 5mb"
//       });
//     }
//     if (error.code == "LIMIT_FILE_COUNT") {
//       return res.status(400).json({
//         message: "Select only 1 File"
//       });
//     }
//   }
//   if (error.message === 'Only PDF files are allowed') {
//     return res.status(400).json({
//       message: 'Only PDF files are allowed',
//     });
//   }
// }; 
//file filter
const fileFilter=(req,file,callback)=>{
  if(file.mimetype=='image/jpg'||file.mimetype=='image/jpeg'||file.mimetype=='image/png')
  {
      callback(null,true)
  }
  else{
      callback(null,false)
      return callback(new Error("Only accepts png/jpg/jpeg format files"))
  }
}
const upload=multer({storage,fileFilter})
module.exports=upload
// module.exports = upload;
