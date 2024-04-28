'use strict'
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    mailer: {
        service: 'Gmail',
        auth: {
            user: process.env.USER_GMAIL,
            pass: process.env.PASSWORD
        },
    },
    dbConnstring: 'mongodb://127.0.0.1:27017/coderZ',
    sessionKey: process.env.SESSION_KEY
}
