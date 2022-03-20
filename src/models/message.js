
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

const messageSchema = sequelize.define("Message",{
        message: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        chat_ID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        user_ID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        image: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: currentDate() 
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: currentDate() 
        },
        username: {
            type: Sequelize.VIRTUAL
        },
        profile_pic: {
            type: Sequelize.VIRTUAL
        }
});


module.exports = messageSchema