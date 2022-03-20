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

const likeSchema = sequelize.define("likes",{
    user_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    news_ID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    liked: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    icon_color: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "white"
    }
   
}, {
    freezeTableName: true,
    timestamps: false
});


module.exports = likeSchema