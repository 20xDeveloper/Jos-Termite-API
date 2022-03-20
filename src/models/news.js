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
    console.log("here is the value for formatted ", formatted)
	return formatted;
}

const newsSchema = sequelize.define("News",{
    // title: {
    //     type: Sequelize.STRING,
    //     allowNull: true
    // },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    userID: {
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
        // this virtual property will be used to attach the username of the poster
        posterName: {
            type: Sequelize.VIRTUAL
        },
        user_profile_pic: {
            type: Sequelize.VIRTUAL
        },
        likes: {
            type: Sequelize.VIRTUAL
        },
        icon_color: {
            type: Sequelize.VIRTUAL
        },
        number_of_comments: {
            type: Sequelize.VIRTUAL
        }
        // dislikes: {
        //     type: Sequelize.VIRTUAL
        // }
});


module.exports = newsSchema