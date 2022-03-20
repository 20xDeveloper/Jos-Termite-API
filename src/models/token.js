const Sequelize = require('sequelize')
const jwt = require('jsonwebtoken')

const sequelize = require("../db/sequelize")

const User = require("./user");

const TokenSchema = sequelize.define("token", {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    tableName: 'tokens',
    classMethods: {
        associate : function(models) {
          TokenSchema.belongsTo(models.User)
        }
    },
    setterMethods: {
        //you have to pass the user object to use this model method
        async generateAuthToken(user) {
              console.log("hello world 3");

              const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET)
              this.setDataValue('token', token);
              this.setDataValue('userId', user.id);
              
              // const names = value.split('');
            
              // this.setDataValue('firstname', names.slice(0, -1).join(' '));
              // this.setDataValue('lastname', names.slice(-1).join(' '));

      }, 
    }
  })


module.exports = TokenSchema