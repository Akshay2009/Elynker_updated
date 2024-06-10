// app.js
const {sendMail} = require('./app/config/mailer');
require('dotenv').config();

const mailOptions = {
    from: process.env.MAIL_FROM, // sender address
    to: 'akshay.saxena@esoftech.com',                 // list of receivers
    subject: 'Hello ✔',                       // Subject line
    text: 'Hello world?',                     // plain text body
    html: '<b>Hello world?</b>'               // html body
};

sendMail(mailOptions)
    .then(info => {
        console.log('Message sent: %s', info.messageId);
    })
    .catch(error => {
        console.error('Error sending email:', error);
    });