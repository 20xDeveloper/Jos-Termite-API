const sgMail = require('@sendgrid/mail') //module we installed make sure you install it.
// const Shop = require('../models/shop')
const nodemailer = require("nodemailer");

//btw we are using one of the environment variable from the dev.env file in the config directory. it's SENDGRID_API_KEY BTW its a convention to have all capitals for environment variables and no camel casing instead we just separate the word with underscore.
sgMail.setApiKey(process.env.SENDGRID_API_KEY) //before you do anything you have to set the api key or the api will not give you a response. it wont know who you are and if you even made an account with them. btw this is a professional email thing because they ask for the company name and all that good stuff.

const sendWelcomeEmail = async (email, name, userId, shopId) => { //we created a function because we are going to export it for it to be used any where in oru application
    let shop = await Shop.findOne({where: {id: shopId}})
    let ShopURL = shop.website
    try{
        // nodemailer
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        // let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
            user: "blissful4469@gmail.com", // generated ethereal user
            pass: "deepthroat" // generated ethereal password
            }
        });
        // btw the above email account is my stupid friend who created it. I should probably use another one 
        // but im too lazy to create another one

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'blissful4469@gmail.com', // sender address
            to: email, // list of receivers
            subject: "Email Verification", // Subject line
            // text: "Hello world?", // plain text body
            html: "Welcome " + name + ". Click on this link to verify your email <a href='" + ShopURL + "/verify/" + userId + "'>" + ShopURL + "/verify/" + userId + "</a>" // html body
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }catch(error){
        console.log(error)
    }
    
}

const sendCancelationEmail = (email, name) => { //when someone cancels the subscription 
    sgMail.send({
        to: email,
        from: 'andrew@mead.io',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.` //by the way there is an html property where you can create your own html page for the email to design the way you want it to make it look fancy. you can use inline css style to make it look more fancy. or link your external css file.
    })
}

const resetPassword = async (email, name) => { //when someone cancels the subscription 
    const tempPassword = await Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    // sgMail.send({
    //     to: email,
    //     from: 'lami@digitalmedia.ca',
    //     subject: 'Reset Password',
    //     text: `Hello ${name}, Here is a temporary password you can use to login: ${tempPassword} Once you log in make sure to change your password.` //by the way there is an html property where you can create your own html page for the email to design the way you want it to make it look fancy. you can use inline css style to make it look more fancy. or link your external css file.
    // })


    try{
        // nodemailer
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        // let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "blissful4469@gmail.com", // generated ethereal user
                pass: "deepthroat" // generated ethereal password
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'blissful4469@gmail.com', // sender address
            to: email, // list of receivers
            subject: "Password Reset", // Subject line
            // text: "Hello world?", // plain text body
            html: "Hello " + name + ", Here is a temporary password you can use to login: " + tempPassword + "Once you log in make sure to change your password." // html body
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return tempPassword
    }catch(error){
        console.log(error)
    }
}

//we are exporting the two functions we created.
module.exports = {
    sendWelcomeEmail, 
    sendCancelationEmail,
    resetPassword
}