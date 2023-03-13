const { cloudinary } = require("../utils/cloudinary");

exports.uploadImage = async (req, res) => {
  try {
    console.log(req.body);
    const { urls, fname } = req.body;
    console.log(urls);
    const uploadResponse = await cloudinary.uploader.upload(urls, {
      upload_preset: "mqmmersr",
    });
    console.log("uploaded responses: ", uploadResponse);
    res.json(uploadResponse);
  } catch (err) {
    console.log("error in image uploading on cludinary:", err);
  }
};

// exports.ImageDisplay= async(req,res)=>{
//   try {
//     const imageVal= await 
//   } catch (error) {
//     console.log(error)
//   }
// }