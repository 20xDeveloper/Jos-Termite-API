const express = require('express')
const cors = require('cors')
const auth = require("./middleware/auth")
const csrf = require('csurf');
const csrfProtection = csrf();
const port = process.env.PORT
const userRouter = require('./routers/user')
const newsRouter = require('./routers/news')
const chatRouter = require('./routers/chat')
const commentRouter = require('./routers/comment')
const notificationRouter = require('./routers/notification')


const http = require('http')
const socketio = require('socket.io')
var bodyParser = require('body-parser')

// Models
const Message = require("./models/message")
const Chat = require("./models/chat")
const User = require("./models/user")





const router = new express.Router()
const session = require('express-session'); //this is the session package to create a session

const sequelize = require("./db/sequelize");

const app = express()
// app.use(bodyParser.urlencoded({
//   parameterLimit: 100000,
//   limit: '50mb',
//   extended: false
// }));

// Check if this has something to do with getting the images when the client uploads an image. maybe that is why we aren't getting it
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const server = http.createServer(app)
const io = socketio(server)


// app.use(express.json())



sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  

app.use(cors())
app.use(notificationRouter)


app.use(userRouter)
app.use(chatRouter)
app.use(newsRouter)
app.use(commentRouter)





// put all this in a file and make the app.use() it

let online_users = []


// A good way to know the order is from top to bottom. I made the events that will fire from top to bottom. So, just keep going back and forth from client to server from top to bottom to understand how it works.
io.on('connection', async (socket) => {
  console.log('A user has joined the chat room!')





  // When a user is joining a room
  socket.emit('was connection successful', true)

  socket.on('new user joined the room', async (username, channel_name) => {

    // -- Get list of current online users and update it if neccessary -- 
    await online_users.push(username) // I never understood the point for making something immutable

    io.emit('recieve list of online users', online_users)



    // -- get past messages procedure --

    // Get the chat ID for the channel_name that was provided by the client
    let chat_ID_for_channel_name = await Chat.findOne({
      where: {
        name: channel_name
      }
    })


    // Get the past messages from the database table called messages
    let past_messages_for_this_channel = await Message.findAll({
      where: {
        chat_ID: chat_ID_for_channel_name.id
      }
    })


    // Get the user name for each message
    let past_messages_with_username = []
    
    for(const past_message of past_messages_for_this_channel){
      let username_for_this_past_message = await User.findOne({
        where: {
          id: past_message.user_ID
        }
      })

      past_message.username = username_for_this_past_message.name
      past_message.profile_pic = username_for_this_past_message.profile_pic

      past_messages_with_username.push(past_message)
    }


    io.emit('recieve past messages for this channel', past_messages_with_username)
  })





  // Note: The client is keeping track of all the messages. Once they enter a chat room they get all the previous messages for that channel and when ever they send or recieve messages they are keeping track of that while each time they do send a message
  // it is getting save to the database table so if a new user joins the room they will have all the messages that the user just sent recently. 
  // -- When a user is sending messages --
  socket.on('broadcast user message', async (user_message, username, channel_name, image) => {
    try{
       // -- Create the message record --

        // Get user ID for the creation of the message record so we can save it in the database table and load the previous messages when a user enters a room
        let user_ID_for_this_message = await User.findOne({
          where: {
            name: username
          }
        })

        // Now get the Chat room ID using the channel_name parameter that was passed to this socket event listener. We also need this for the creation of the message record to save it in the database table
        let chat_ID_for_this_message = await Chat.findOne({
          where: {
            name: channel_name
          }
        })


        let save_user_message_to_this_channel = await Message.create({
            message: user_message,
            chat_ID: chat_ID_for_this_message.id,
            user_ID: user_ID_for_this_message.id,
            image: image
        })

        save_user_message_to_this_channel.save() // the reason i didn't use await here is because i want the chat experience to be faster.

        // Attach the username to the virtual property called username in the message sequelize model instance then pass it back to the client('S').
        save_user_message_to_this_channel.username = username
        save_user_message_to_this_channel.profile_pic = user_ID_for_this_message.profile_pic


        io.emit("recieve user message", save_user_message_to_this_channel)
    }catch(error){
        console.log("here is the error message ", error.message)
    }
   
  })






  // -- when a user is leaving --
  socket.on('disconnecting', (user_who_left) => { // we use this to passed the parameter user_who_left
      online_users =  online_users.filter((online_user_name) => {
        return online_user_name !== user_who_left // if it finds the user who has that user name it will remove it because it returned false. that is how the filter method works.
      })

      io.emit('recieve list of online users', online_users)
    })

  socket.on('disconnect', () => { // the actual reserved disconnect event
    console.log("A user left the room!")
  })

})

// ends here





server.listen(port, () => {
  console.log('Server is up on port ' + 3000)
})



