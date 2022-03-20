// const mongoose = require('mongoose')
// const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Sequelize = require('sequelize')

const sequelize = require("../db/sequelize")


const Token = require("./token");



const userSchema = sequelize.define("User",{
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        trim: true,
        unique: true // we use this to find the user id when getting the past message for a chat room
        
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        trim: true,
        lowercase: true,
        validate: {
            isEmail(value) {
                if (value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g) === null) {
                  throw new Error('Please enter a valid email.');
                }
              }
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        trim: true
    },
    admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    profile_pic: {
        type: Sequelize.TEXT,
        allowNull: true,
        trim: true

    },
    expo_push_notification_token: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    // verified: {
    //   type: Sequelize.INTEGER,
    //   defaultValue: 0
    // },
    // billingId: {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    //   references: {
    //     model: 'BillingAddress',
    //     key: 'id'
    //   }
    // // },
    // shopId: {
    //     type: Sequelize.INTEGER,
    //     // defaultValue: null,
    //     references: {
    //       model: 'Shop',
    //       key: 'id'
    //     }
    // },
    createdAt: {
      type: Sequelize.DATE
    }
    // tokens: [{
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }]
}
// , {
  
  
//     tableName: 'users',
//     classMethods: {
//         associate : function(models) {
//           userSchema.belongsTo(models.Shop)
//         }
//     },
  
//   getterMethods: {
//     //you have to pass the model that you required in that script
//     async findByCredentials(email, password) {
//       const user = await userSchema.findOne({ email })

//       if (!user) {
//           throw new Error('Unable to login')
//       }

//       const isMatch = await bcrypt.compare(password, user.password)

//       if (!isMatch) {
//           throw new Error('Unable to login')
//       }

//       return user
//       }
//     },
//   setterMethods: {
//       //you have to pass the user and product object to use this model method
//       async addToCart(product, user) {
//         try{
//            //get all the cart items of a user
//            let items = await Item.findAll({where: {
//             userId: user.id
//           }})
//           console.log(items)
//           //find the index of the item in the user cart
//           //this will help us increase the quantity later on
//           const cartProductIndex = items.findIndex(item => {
//               return item.productId === product.id;
//           });

//           //by default they will have 1 as their quantity
//           let newQuantity = 1;

//           //if they found a match in the user cart items increase the quantity by 1
//           //else create a new record which means you add a new item to your shopping cart
//           if (cartProductIndex >= 0) {
//             console.log("increasing the quanitiy")
//               items[cartProductIndex].quantity = items[cartProductIndex].quantity + 1;

//               items[cartProductIndex].save()
//               //the below line might cause error.
//               // items[cartProductIndex].setDataValue('quantity', newQuantity)
//           } else {
//               Item.create({userId: user.id, productId: product.id, quantity: newQuantity })
              
//           }
//         }catch(e){
//           console.log("error occured in the addToCart method of the user model ", e)
//         }
         

//     } 
//   }
// }
);

// userSchema.belongsTo(Shop)


//when ever you send back information to the client you will always exclude password and tokens. .toJSON is when ever you json.strifigiy and node.js does it behind the scenes when ever you pass data to the client
// userSchema.methods.toJSON = function () {
//     const user = this
//     const userObject = user.toObject()

//     delete userObject.password
//     delete userObject.tokens

//     return userObject
// }

// userSchema.methods.generateAuthToken = async function () {
//     const user = this
//     const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

//     user.tokens = user.tokens.concat({ token })
//     await user.save()

//     return token
// }

// userSchema.prototype.generateAuthToken = async (userId) => {
//   const generatedToken = await jwt.sign({ id: userId }, process.env.JWT_SECRET)
//   const token = new Token({ userId: userId, token: generatedToken})

//   await token.save();
  
//   //always remember to return something or it will freeze your program
//   return token
// }

//I got this instance method from max project
// userSchema.methods.addToCart = function(product) {
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];
  
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: product._id,
//         quantity: newQuantity
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems
//     };
//     this.cart = updatedCart;
//     return this.save();
//   };

  //this instance method clears the cart. used when finishing checking out
//   userSchema.methods.clearCart = function() {
//     this.cart = { items: [] };
//     return this.save();
//   };

//   //this instance method removes a cart item
//   //the key word this is refferring to the instance of the model object
//   //user model has a cart field
//   userSchema.methods.removeFromCart = function(productId) {
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== productId.toString();
//     });
//     this.cart.items = updatedCartItems;
//     return this.save();
//   };

// userSchema.statics.findByCredentials = async (email, password) => {
//     const user = await User.findOne({ email })

//     if (!user) {
//         throw new Error('Unable to login')
//     }

//     const isMatch = await bcrypt.compare(password, user.password)

//     if (!isMatch) {
//         throw new Error('Unable to login')
//     }

//     return user
// }

// // Hash the plain text password before saving. pretty much when ever you save in the program.
// userSchema.pre('save', async function (next) {
//     const user = this

//     if (user.isModified('password')) {
//         user.password = await bcrypt.hash(user.password, 8)
//     }

//     next()
// })

// // Delete user shopping cart when user is removed
// userSchema.pre('remove', async function (next) {
//     const user = this
//     await ShoppingCart.deleteMany({ userId: user._id })
//     next()
// })

// const User = mongoose.model('User', userSchema) //btw the second argument for model of the mongoose object you usually pass an object which is litterally the value of the mongoose schema. we use to do it like that in the first weeks of this course but we don't anymore because this is the better way we have access to more features. to see how we did it the old way look at the previous weeks. like the first couple of weeks of the course. you will get a better understanding of how everything works. 

module.exports = userSchema