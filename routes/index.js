var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var config = require('../config');
var transporter = nodemailer.createTransport(config.mailer);
var { validationResult } = require('express-validator');
var { check, body } = require('express-validator');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('User name:', req.user ? req.user.name : 'Not logged in');
  res.render('index', { title: 'CoderZ - A platform to share code', user: req.user});
});

router.get('/about', function(req, res, next) {
  res.render('about', {title: 'CoderZ - A platform to share code'});
});

router.route('/contact')
.get(function(req, res, next) {
  res.render('contact', {title: 'CoderZ - A platform to share code'});
})
.post([
  body('name').notEmpty().withMessage('Empty name'),
  body('email').isEmail().withMessage('Invalid Email'),
  body('message').notEmpty().withMessage('Empty Message')
], function(req, res, next) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('contact', {
      title: 'CoderZ - A platform to share code!',
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      errorMessages: errors.array()
    });
  } else {
    var mailOptions = {
      from: 'CoderZ <no-reply@coderz.com>',
      to: 'demo.codeeditor@gmail.com',
      subject: 'You got a new message from visitor',
      text: req.body.message
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(500).send('Error sending email');
      }
      res.render('thank', { title: 'CoderZ - A platform to share code' }); // This line moved here
    });
  }
});

module.exports = router;
