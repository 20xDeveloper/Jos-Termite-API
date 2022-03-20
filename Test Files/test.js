const express = require('express')
// const multer = require('multer')
// const sharp = require('sharp')
const User = require('../models/user')

// const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs') //used for hashing passwords
const userUtils = require('../utils/userUtils');
const formidable = require('formidable');


const auth = require('../middleware/auth')
const { sendWelcomeEmail, resetPassword } = require('../emails/EmailSender')
const router = new express.Router()
const Multer = require('multer');


const multer = Multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images' )
        console.log(file)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
  });
const upload = Multer({storage: multer})


router.post('/users/upload-profile-picture', upload.single('image'), async (req, res) => {
    // const form = new formidable.IncomingForm(); // Used when passing form data from the front end. If you don't use this you wont get your value or some other errors will happen. Don't remember exactly
    // form.parse(req, async (err, fields, files) => {
      try { 
        // const product = await new Product({
        //   name: fields.name,
        //   price: fields.price,
        //   description: fields.description,
        //   stock: fields.stock,
        //   sku: fields.sku,
        //   categoryId: fields.categoryId,
        //   shopId: fields.shopId,
        //   firebaseImageURL: fields.firebaseImageURL, // In the front end we saved the image on firebase cloud storage (BaaS). So we are saving the url for it so when display the list of products it will get it's image
        //   length: fields.length,
        //   width: fields.width,
        //   height: fields.height,
        //   weight: fields.weight
        // });
    
        // await product.save()

     
        // -- Upload the image to google cloud storage --
        const {Storage} = require('@google-cloud/storage');

        // Creates a client
        const projectId = "steel-lacing-261704"
        const keyFilename = 'steel-lacing-261704-4e9b35bb89e1.json' // I'm not sure if the properties for the object you pass when instantiating a new storage object has to be those exact property names which are keyfilename and project-id
        const storage = new Storage({projectId, keyFilename});
      
        let file = "images/" + req.file.originalname
        let bucketName = "users_profile_pictures"

          // Uploads a local file to the bucket
          await storage.bucket(bucketName).upload(file, {

            // Support for HTTP requests made with `Accept-Encoding: gzip`
            gzip: true,

            // By setting the option `destination`, you can change the name of the
            // object you are uploading to a bucket.
            metadata: {
              // Enable long-lived HTTP caching headers
              // Use only if the contents of the file will never change
              // (If the contents will change, use cacheControl: 'no-cache')
              cacheControl: 'public, max-age=31536000',
            },

          });
      
          console.log(`${file} uploaded to ${bucketName}.`);


         // -- Save the profile picture file name to the database table to view it later --
          



    
        res.send({ user_profile_picture_file_name: req.file.originalname })
    } catch (e) {
      res.status(400).send({ error: e.message })
      console.log("here is the error message ", e.message)
  
    }


    // }) // This was for form.parse function
})



//create a user account along with their shopping cart
router.post('/users', async (req, res) => {
    try{
        req.body.password = await bcrypt.hash(req.body.password, 8)

        // Validate the user input

        // Check if username is unique
        // First get all the users from the database table to see if the username the user entered is unique
        let get_list_of_all_current_users = await User.findAll()
        let is_new_user_name_unique = await get_list_of_all_current_users.filter((existing_user) => existing_user.name === req.body.name)
        let is_new_user_email_unique = await get_list_of_all_current_users.filter((existing_user) => existing_user.email === req.body.email.trim().toLowerCase())

        console.log("email is not unique ", is_new_user_email_unique.length)

        if(is_new_user_name_unique.length > 0 ){
            throw new Error("The username you entered is already taken.")
        }else if(is_new_user_email_unique.length > 0){
            // Email is already taken care of from the model validation. Sequelize validation tools are really bad so I decided to make my custom ones.
            // The only thing sequelize couldn't take care of is if it already exist. sequelize validation tool is terrible.
            throw new Error("An account with this email already exist.")
        }

        
        
        
        // The front end checks if all the fields are filled in.
        

        // Make sure the front end passed the shopId or it will crash. It can be in a invisible field
        const user = new User(req.body)
        await user.save()

        let token = await userUtils.generateAuthToken(user)

        // sendWelcomeEmail(user.email, user.name, user.id, user.shopId)

        res.status(201).send({ user, token })

    } catch (error) {
        res.send({error: error.message.replace("Validation error:", "")}) // for some reason if i put status 400 my error does not get catched in the front end. also just letting you know in the front end you have to do error.message just like how we are doing it here to get the emssage of the error.
        // it's basic knowledge when it comes to getting the error message from a try and catch block.

    }
})

//login the user and generate an auth token for the user to perform authenticated actions.
router.post('/users/login', async (req, res) => {
        try{
            const user = await User.findOne({where: {email: req.body.email}}) //Look for the user profile by the email they entered when logging in
            await userUtils.findByCredentials(user, req.body.password) //Checks if the credentials they entered are valid
            const token = await userUtils.generateAuthToken(user) //Generate a user token so he/she can perform authenticated actions. Only if the above lines did not throw an error and triggered the catch block

            // res.setHeader('Set-Cookie', 'loggedIn=true') // I believe this never worked for me
            res.send({ user, token })
        }catch(e){
            console.log("here is the error message in the log in route handler function ", e.message)
            res.send( {invalid: "The credentials you entered was invalid.", error: e})
        }   
})

// Update the user account information
router.post('/users/edit', async (req, res) => {
    try{
        let find_existing_user_to_update = await User.findOne({
            where: {
                id: req.body.id
            }
        })

        // Update this user information

        // First make sure the password is hashed before we save it into the database table
        req.body.password = await bcrypt.hash(req.body.password, 8)

        const updates = Object.keys(req.body)

        updates.forEach((update) => find_existing_user_to_update[update] = req.body[update])

        await find_existing_user_to_update.save()

        res.send({message: "You have successfully updated the user information!"})


    }catch(e){
        console.log("Here is the error message when updating the user info ", e)
    }   
})

// Get online users with profile picture for the right drawer on the chat room screen. Our socket event just keeps track of the online USER NAMES
router.post('/users/get-profile-picture-for-right-drawer', async (req, res) => {
    try{
        let online_users_with_profile_picture = []
        console.log("1 ", req.body.online_users_names)
        for(const online_user_name of req.body.online_users_names){
            let get_online_users_with_profile_picture = await User.findOne({
                where: {
                    name: online_user_name // Don't worry the user name has to be unique in the database table so there wont be any conflict.
                }
            })

            online_users_with_profile_picture.push(get_online_users_with_profile_picture)
        }
     
        res.send({online_users_with_profile_picture})

    }catch(e){
        console.log("Here is the error message when updating the user info ", e)
    }   
})

// Get all users on this App
// this is for when the admin wants to change one of the existing users name
router.get('/users', async (req, res) => {
    try{
        let all_users_on_this_app = await User.findAll()


        res.send({all_users_on_this_app})


    }catch(e){
        console.log("Here is the error message when updating the user info ", e)
    }   
})

// //logout the user and remove that specific token. reason we have an array of tokens is because each one is for each device that user log in with. so one can be the desktop the other could be from his tablet or phone.
// router.post('/users/logout', auth, async (req, res) => {
    
//     try {
//         // The below line is used to find the token 
//         let token = await Token.findOne({where: {userId: req.token.userId, token: req.token.token}})
//         await token.destroy({force: true})
        
//         await token.save()
        
//         console.log("test")
//         res.send()
//     } catch (e) {
//         res.status(500).send()
//     }
// })

// //logs out all the user from any device. like desktop, tablet etc. this is good for when you deleted an user account.
// router.post('/users/logoutAll', auth, async (req, res) => {
//     try {
//         await Token.destroy({where: { userId: req.token.userId }}, {force: true})
       
//         // await userNewTokenList.save() // I guess you don't have to save when you destroy something

//         res.send({ message: "You have successfully deleted your account!"})
//     } catch (e) {
//         res.status(500).send()
//     }
// })

// //get the user profile
// router.get('/users/me', auth, async (req, res) => {
//     res.send(req.user)
// })

// // Update the user 
// router.patch('/users/me', auth, async (req, res) => {
//     const updates = Object.keys(req.body) // Get the keys for the form data the frontend passed
//     const allowedUpdates = ['name', 'email', 'password'] // These are the only keys youa accept as updates
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // This line checks if the keys the user passed as form data matches the allowed updates

//     // If the above line returned false then throw an error telling them they cannot update that. They are probably hacking
//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     try {
//         //I guess you can access properties using that syntax like an associative array. 
//         updates.forEach((update) => req.user[update] = req.body[update]) // Update the user profile with the same key from the req.body which is the form data
//         await req.user.save() // saving the user
//         res.send(req.user) // Object destructuring
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

// // *INCOMPLETE - DOES NOT WORK COME BACK TO THIS LATER TO FIX IT
// //if the user wants to delete the account
// router.delete('/users/me', auth, async (req, res) => {
//     try {
//         await User.destroy({where: { id: req.user.id }}, {force: true})
//         console.log("does not run the above statement")

//         // sendCancelationEmail(req.user.email, req.user.name) //when a user wants to delete his account thats what this route handler is doing. remember req.user value was set in the auth middle ware. then it was passed down to this route handler call back function which was the next argument. look at the auth middleware to get a better understanding. look at line 15 to see req.user value being set.
//         res.send(req.user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

// // You should use this API endpoint when a user signs up so they can verify their email before they can start using it
// // In our database we have a column called verify. Don't know what exactly this is for but if it's used to prevent the user from using the site
// // until he verifies then we should add this to our middleware to check everytime they do an action that require authentication. 
// // if not and it's for just sending email to them we should work with that.
// // The way this route handler functionw orks is that you are suppose to send a link to the user through email
// // on that link when they click on it it takes you to the shopping cart site and when you load that page
// // it sends a request to this API and this route handler function specifically. it has the user id passed
// // as a parameter automatically. Look at the sendWelcomEmail() function in the custom module i created called emailSend.js file
// router.patch('/users/verify/:id', async (req, res) => {
//     const user = await User.findOne({where: {id: req.params.id}})
//     user.verified = 1
//     try {
//         await user.save()

//         res.send({message: "You have successfully verified your email!"})
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

// // Reset the password for a certain user and give them a temp password and let him know what the temp password is by sending him an email
// router.patch('/users/password/reset', async (req, res) => {
//     try{
//         const user = await User.findOne({where: {email: req.body.email}}) //find the user

//         let tempPassword = await resetPassword(req.body.email, user.name) // Create a temp password and the password to the user by email to know what the temp password is
//         console.log("here is the value for the temp password ", tempPassword)
//         tempPassword = tempPassword.toString() //Make the temp password a string before it was a number because we used math.random and all kinds of stuff
//         user.password = await bcrypt.hash(tempPassword, 8) // hash the password because we check the database by using the bcrypt library compare method when logging a user in

//         await user.save() // save that hash new temp password to the user profile because he forgot his old password
//     }catch(e){
//         console.log(e)
//     }
    

    
// })


module.exports = router