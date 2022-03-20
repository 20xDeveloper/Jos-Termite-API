const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Token = require('../models/token')


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '') // The front end will have to pass the token through the header 
        const userToken = await Token.findOne({ where: {token: token} }) // Look if the token exist in the table if not then they are not logged in
        const user = await User.findOne({ where: {id: userToken.userId}}) // Look for the user profile through the token userId field

        if (!user) { // If user was not found then something is wrong here
            throw new Error()
        }

        // Set req.token and req.user to the token and the user profile so we can use it in the route handler function
        req.token = userToken
        req.user = user

        // You use next() to move on to the next step. You use this when you want to declare this function to be a middle ware
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.', external_error: e })
    }
}

module.exports = auth