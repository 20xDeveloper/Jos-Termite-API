const express = require('express')
// const multer = require('multer')
// const sharp = require('sharp')
const User = require('../models/user')
const Newsis = require('../models/news')
const Chat = require('../models/chat')
const Message = require('../models/message')


//

// const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs') //used for hashing passwords
const userUtils = require('../utils/userUtils');


const auth = require('../middleware/auth')
const { sendWelcomeEmail, resetPassword } = require('../emails/EmailSender')
const router = new express.Router()

// Get the list of chat channels
router.get('/chat/chat-channels', async (req, res) => {
    try{
        // Get all the news data
        let chat_channels = await Chat.findAll()
        
        res.status(201).send({ chat_channels })
    } catch (e) {
        res.status(400).send({e: e.message})
        console.log("here is the error message when getting the list of chat channels ", e)
    }
})

// get the previous message of a channel. We use this when a user enters a room
router.post('/chat/chat-channels/previous-messages', async (req, res) => {
    try{
        // first find the ID that belongs to this chat channel name
        // remember to make the database table to have the field name in the chat table to be unique so we don't ever get into a problem and display an error to the user if the chat channel anme already exist
        let get_this_chat_channel_ID = await Chat.findOne({
            where: {
                name: req.body.channel_name
            }
        })

        // we are not sure if it will get list of messages from newest to old to display in that order
        let get_this_chat_channel_previous_messages = await Message.findAll({
            where: {
                chat_ID: get_this_chat_channel_ID.id
            }
        })

        let list_of_messages_with_user_name = []

        // Loop through the list of messages for this channel and attach the username virtual property to each message object
        for(let message of get_this_chat_channel_previous_messages){
            // Find the user record using the user_ID in the message object
            let user_record_for_this_message = await User.findOne({
                where: {
                    id: message.user_ID
                }
            })

            // Attach the user name to the virtual property in the message object
            message.username = user_record_for_this_message.name

            // Push to the updated messages array that consists of each message with the user name attached to it as a virtual sequalize property
            list_of_messages_with_user_name.push(message)
        }

        res.send({chat_channel_previous_messages: list_of_messages_with_user_name})
    } catch (e) {
        res.status(400).send({e: e.message})
        console.log("here is the error message when getting the list of chat channels ", e)
    }
})

router.post('/chat/chat-channels/create', async (req, res) => {
    try{
        // Get all the news data
        let new_chat_channel = await Chat.create(req.body)
        
        res.status(201).send({ new_chat_channel })
    } catch (e) {
        res.status(400).send({e: e.message})
        console.log("here is the error message when getting the list of chat channels ", e)
    }
})


// // get all the news
// router.post('/newsis/post-news', async (req, res) => {
//     try{
//         let create_news = await Newsis.create({
//             description: req.body.news_description,
//             userID: req.body.userID
//         })
//         await create_news.save()
        
//         res.status(201).send({ message: "You have successfully posted a news!" })
//     } catch (e) {
//         res.status(400).send({e: e.message})
//         console.log("here is the error message when getting posting a news ", e)
//     }
// })




module.exports = router