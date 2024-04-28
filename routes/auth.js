var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var { body, validationResult } = require('express-validator');

router.route('/login')
    .get(function(req, res, next) {
        res.render('login', { title: 'Login to your account' });
    })
    .post(passport.authenticate('local', {
        failureRedirect: '/login',
    }), function(req, res) {
        res.redirect('/');
    });

router.route('/signup')
    .get(function(req, res, next) {
        res.render('signup', { title: 'Sign Up for new account' });
    })
    .post([
        body('name').notEmpty().withMessage('Empty Name'),
        body('email').isEmail().withMessage('Invalid Email'),
        body('password').notEmpty().withMessage('Empty Password'),
        body('confirmPassword').notEmpty().withMessage('Confirm Password is required')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Password do not match');
                }
                return true;
            })
    ], function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty())  {
            res.render('signup', {
                name: req.body.name,
                email: req.body.email,
                errorMessages: errors
            });
        } else {
            var user = new User({
                name: req.body.name,
                email: req.body.email
            });
            user.setPassword(req.body.password);
            user.save()
                .then(function(savedUser) {
                    res.redirect('/login');
                })
                .catch(function(err) {
                    res.render('signup', {
                        name: req.body.name,
                        email: req.body.email,
                        errorMessages: err
                    });
                });
        }
    });

    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

module.exports = router;
