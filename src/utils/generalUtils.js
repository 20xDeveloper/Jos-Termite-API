const User = require('../models/user')
const Newsis = require('../models/news')
const Like = require('../models/like')
const Comments = require('../models/comment') // I called it comments instead of comment is because comment is reserved for something else. It's predefined.

const Sequelize = require("./../db/sequelize");


//object literal is my preffered way of creating a javascript class
let generalUtils = {
    precise_round: (num, dec) => {
          if ((typeof num !== 'number') || (typeof dec !== 'number')) 
          return false; 
        
          var num_sign = num >= 0 ? 1 : -1;
            
          return (Math.round((num*Math.pow(10,dec))+(num_sign*0.0001))/Math.pow(10,dec)).toFixed(dec);
    },

    get_newsis: async (user_ID) => {
          // Get all the news data
          let newsis = await Newsis.findAll({  order: [
            // Will escape title and validate DESC against a list of valid direction parameters
            ['createdAt', 'DESC'], ]})

        // loop through the news data to attach the username to the virtual posterName property in the news model object
        let list_of_news_with_poster_name = []
        for(let news of newsis){
            let user = await User.findOne({where: {
                id: news.userID
            }})

            // now each news has a poster name which is the user name of who posted it
            news.posterName = user.name
            news.user_profile_pic = user.profile_pic

            // Get the number of likes and dislikes for this news
            number_of_likes_for_this_news = await Sequelize.query("SELECT COUNT(*) FROM likes WHERE news_ID = " + news.id + " AND liked = 1;", {
                type: Sequelize.QueryTypes.SELECT
            })

            // number_of_dislikes_for_this_news = await Sequelize.query("SELECT COUNT(*) FROM likes WHERE news_ID = " + news.id + " AND liked = 0;",{
            //     type: Sequelize.QueryTypes.SELECT
            // })

            // Store the likes and dislikes to the virtual sequelize property
            news.likes = number_of_likes_for_this_news[0]['COUNT(*)']

            // Check if this news was liked by this user so we can decide what the like icon color should be in the front end
            let news_liked_by_this_user = await Like.findOne({where: {
                user_ID: user_ID,
                news_ID: news.id
            }})

            news.icon_color = news_liked_by_this_user.icon_color

            // Get the number of comments to display beside the comment icon for each news. We do this by storing it as a sequelize virtual property to the news sequelize model
            let get_number_of_comments_for_this_news = await Comments.findAll({
                where: {
                    news_ID: news.id
                }
            })

            news.number_of_comments = get_number_of_comments_for_this_news.length
            
            list_of_news_with_poster_name.push(news)
        }


        return list_of_news_with_poster_name
    },

    get_comments: async (news_ID) => {
        // Get the list of comments for this news
        let comments_for_this_news = Comments.findAll({
            where: {
                news_ID: news_ID
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

        return comments_with_user_profile_pic
    }

}

module.exports = generalUtils
