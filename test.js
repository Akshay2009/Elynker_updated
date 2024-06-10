// app.js
const sendMail = require('./app/config/mailer');

const mailOptions = {
    from: '"Your Name" <anoopgml@gmail.com>', // sender address
    to: 'anoop@esoftech.com',                 // list of receivers
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