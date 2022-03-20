const express = require('express')
const User = require('../models/user')
const Newsis = require('../models/news')
const Comments = require('../models/comment')

const Like = require('../models/like')
const Sequelize = require("./../db/sequelize");
const bcrypt = require('bcryptjs') //used for hashing passwords
const GeneralUtils = require('../utils/generalUtils');
const auth = require('../middleware/auth')

const router = new express.Router()

// get all the comments for a specific news post
router.get('/comments', async (req, res) => {
    try{
        // Get the list of comments for this news
        let comments_for_this_news = await Comments.findAll({
            where: {
                news_ID: req.query.news_ID
            }
        })

        // Attach the user profile pic to each comment as a sequelize virtual property 
        let comments_with_user_profile_pic = []

        for(let comment of comments_for_this_news){
            // Find the user to get the profile picture
            let user_of_this_comment = await User.findOne({
                where: {
                    id: comment.user_ID
                }
            })

            comment.user_profile_pic = user_of_this_comment.profile_pic
            comment.username = user_of_this_comment.name


            comments_with_user_profile_pic.push(comment)
        }

        res.send({comments_with_user_profile_pic}) // ES6 object destructuring syntax
    } catch (e) {
        res.status(400).send({e: e.message})
        console.log("here is the error message when getting the list of comments for a news ", e)
    }
})

// Post a new comment for a news
router.post('/comments', async (req, res) => {
    try{
        console.log("hi")
       // Create the new comment
       let posting_comment_for_this_news = await Comments.create(req.body)
       await posting_comment_for_this_news.save()

        // Find the user to get the profile picture
        let user_of_this_comment = await User.findOne({
            where: {
                id: req.body.user_ID
            }
        })

        posting_comment_for_this_news.user_profile_pic = user_of_this_comment.profile_pic
        posting_comment_for_this_news.username = user_of_this_comment.name


       // Get the updated list of comments again and send it back to the client
       // let updated_list_of_comments = await GeneralUtils.get_comments(req.body.news_ID)

       res.send({posting_comment_for_this_news}) // ES6 object destructuring syntax
    } catch (e) {
        res.status(400).send({e: e.message})
        console.log("here is the error message when posting a new comment ", e)
    }
})






module.exports = router