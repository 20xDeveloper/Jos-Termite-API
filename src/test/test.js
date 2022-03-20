// uploading image dependencies
// const Multer = require('multer');
// const imgUpload = require('../middleware/imgUpload');

// const multer = Multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images' )
//         console.log(file)
//     }
//   });
// const upload = Multer({storage: multer})

//   router.post('/users/image-upload', multer.single('image'), imgUpload.uploadToGcs, function(request, response, next) {
//       try{
//           console.log("1")
//         const data = request.body;
//         console.log("2")
//         if (request.file && request.file.cloudStoragePublicUrl) {
//             console.log("3")
//           data.imageUrl = request.file.cloudStoragePublicUrl;
//         }
//         console.log("4")
//         response.send(data);
//         console.log("5")
//       }catch(error){
//         console.log("here is the error message ", error)
//         console.log("6")

//       }
   
//   })


