
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

const chatsSchema = sequelize.define("Chat",{
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: currentDate() 
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: currentDate() 
        },

});


module.exports = chatsSchema