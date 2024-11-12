const multer = require("multer");
const xlsx = require("xlsx");
 
const upload = multer().single('file'); // 'file' should match the form field name

// Function To Process The Excel File
const processExcel = async (buffer) => {
  try {
    const workbook = xlsx.read(buffer, {type:"buffer"}) 
    const sheetNames = workbook.SheetNames 
    const sheet = workbook.Sheets[sheetNames[0]] 
    const jsonData = xlsx.utils.sheet_to_json(sheet)
    return jsonData

  } catch (error) {
    return res
      .status(500)
      .send("Error processing Excel file: " + error.message);
  }
};

const uploadAndProcessExcel = async(req, res, next) => {
  upload(req, res, async(err) => {  
    
    if (err) {
      console.error("Error uploading file:", err.message);
      return res.status(400).send("Error uploading file: " + err.message);
    }
    
    if (!req.file) {
      console.error("No file uploaded.");
      return res.status(400).send("No file uploaded.");
    }

    try { 
      const jsonData = await processExcel(req.file.buffer); // Process the buffer
      req.excelData = jsonData;
      console.log("Excel data processed:", req.excelData);  // Verify processed data
      next();
    } catch (error) {
      console.error("Error processing Excel file:", error.message);
      return res.status(500).send("Error processing Excel file: " + error.message);
    }
  });
};

const getErrorMessages = (error) => {
  console.error("Error fetching users:", error.message); // Log the error message
  let errObj = error.errors;
  if (error.errors) {
    return (
      Object?.keys(errObj)?.map((d) => errObj[d]["message"]) || error.message
    );
  }
  return error;
};

module.exports = { uploadAndProcessExcel, getErrorMessages };

// const multer = require("multer");
// const xlsx = require("xlsx");

// // Set up multer to use memory storage
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 10 * 1024 * 1024 },
// }).single("file"); // You can modify this to handle multiple files as well if needed

// // Function to process Excel data from a file buffer
// const processExcel = (buffer) => {
//   try {
//     const workbook = xlsx.read(buffer, { type: "buffer" });
//     const sheetNames = workbook.SheetNames;
//     const sheet = workbook.Sheets[sheetNames[0]];
//     const jsonData = xlsx.utils.sheet_to_json(sheet);
//     return jsonData;
//   } catch (error) {
//     throw new Error("Error processing Excel file");
//   }
// };

// // Common function to upload and process an Excel file
// const uploadAndProcessExcel = (req, res, next) => {
//   upload(req, res, (err) => {
//     if (err) {
//       return res.status(400).send("Error uploading file: " + err.message);
//     }
//     if (!req.file) {
//       return res.status(400).send("No file uploaded.");
//     }
//     try {
//       const jsonData = processExcel(req.file.buffer);
//       req.excelData = jsonData;
//       next();
//     } catch (error) {
//       return res
//         .status(500)
//         .send("Error processing Excel file: " + error.message);
//     }
//   });
// };
