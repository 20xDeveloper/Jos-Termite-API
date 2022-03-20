// const mongoose = require('mongoose')
// const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Sequelize = require('sequelize')

const sequelize = require("../db/sequelize")


const Token = require("./token");

function currentDate() {
	var dateTime = require("node-datetime");
	var dt = dateTime.create();
	var formatted = dt.format("Y-m-d H:M:S");
	return formatted;
}

const commentSchema = sequelize.define("comments",{
    comment: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    news_ID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    user_ID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: currentDate() 
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: currentDate() 
    },
    image: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    user_profile_pic: {
        type: Sequelize.VIRTUAL
    },
    username: {
        type: Sequelize.VIRTUAL
    },
    number_of_comments: {
        type: Sequelize.VIRTUAL
    }
    
   
});


module.exports = commentSchema