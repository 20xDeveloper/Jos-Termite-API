// const User = require('../models/user')
// const Product = require('../models/product')

const bcrypt = require('bcryptjs')
const Token = require('../models/token')
// const Item = require('../models/item')

const jwt = require('jsonwebtoken')
const db = require('../db/database')



//object literal is my preffered way of creating a javascript class
let userUtils = {
    
    // Used when logging in a user. Checking if the credentials they entered are valid.
    findByCredentials: async (userProfile, password) => {
        
        // If we didn't find a user with the email they provided. We searched through the database in the previous file
        if (!userProfile) {
            throw new Error('Unable to login') //When you use throw new Error it is seen as return and end this function. It wont run the rest of the code
        }

        const isMatch = await bcrypt.compare(password, userProfile.password) // Check if the password they entered is the same as the one in the database for that particular user. Also Bcyrpt compare method first hashes the first argument then compares it with the second argument
    
        if (!isMatch) { // if isMatch returned false it means they entered the incorrect password
            throw new Error('Unable to login')
        }
        
        //If all goes well and no errors has been thrown then return the userProfile and move on to the next lines of code
        return userProfile
    },

    //we used a normal function instead of an arrow function because we want to be able to use the "this" key word
    generateAuthToken: async (user) => {
        try{
            const generatedToken = await jwt.sign({ id: user.id }, process.env.JWT_SECRET) //Creates the json web token using the secret key in our env file depending on which environment we are in.
            console.log("1")
            const token = new Token({ userId: user.id, token: generatedToken}) //Save the token in the database for later use to authenticate a user when performing a login action. When they log out you remove that token. If they are logged into the account in multiple different accounts then there will be multiple different tokens linked to this userId
            console.log("2 ", token)
            console.log("user.id ", user.id)
            console.log("generatedToen ", generatedToken)
            await token.save();
            console.log("3")
            //always remember to return something or it will freeze your program
            return token
        }catch(e){
            throw new Error(e)
        }
        
    },

    addToCart: async (product, user) => {
        try{
           //get all the cart items of a user
            let items = await Item.findAll({where: {
                userId: user.id
            }})

          console.log(items)

          //find the index of the item in the user cart
          //this will help us increase the quantity later on
          const cartProductIndex = items.findIndex(item => {
              return item.productId === product.id;
          });

          //by default they will have 1 as their quantity
          let newQuantity = 1;

          //if they found a match in the user cart items increase the quantity by 1
          //else create a new record which means you add a new item to your shopping cart
          if (cartProductIndex >= 0) {
              console.log("increasing the quantity")
              items[cartProductIndex].quantity = items[cartProductIndex].quantity + 1;

              items[cartProductIndex].save()
              //the below line might cause error.
              // items[cartProductIndex].setDataValue('quantity', newQuantity)
          } else {
              Item.create({userId: user.id, productId: product.id, quantity: newQuantity })
              
          }
        }catch(e){
          console.log("error occured in the addToCart method of the user model ", e)
        }
         

    },

    removeFromCart: async (productId, user) => {
        await Item.destroy({where: {productId: productId, userId: user.id}})
    },

    clearCart: async (userId) => {
        await Item.destroy({ where: { userId: userId } });
    }

}


module.exports = userUtils
