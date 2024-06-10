const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'Gmail', // e.g., 'Gmail', 'Yahoo', 'Outlook'
    auth: {
        user: process.env.EMAIL_USER, // Your email address from environment variables
        pass: process.env.EMAIL_PASS  // Your app-specific password from environment variables
    }
});

/**
 * Send an email using Nodemailer
 * @param {Object} mailOptions - Email options (from, to, subject, text, html)
 * @param {string} mailOptions.from - Sender address
 * @param {string} mailOptions.to - List of receivers
 * @param {string} mailOptions.subject - Subject line
 * @param {string} mailOptions.text - Plain text body
 * @param {string} mailOptions.html - HTML body
 * @returns {Promise} - Resolves with info if the email is sent successfully, rejects with error otherwise
 */
function sendMail(mailOptions) {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
}

module.exports = {transporter,sendMail};
