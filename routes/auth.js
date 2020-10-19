const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

//GET login endpoint => /auth/login
router.get('/login', authController.getLogin);

//GET signup endpoint => /auth/signup
router.get('/signup', authController.getSignup);

//POST login endpoint => /auth/login
router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address.')
            .normalizeEmail(),
        body('password', 'Password has to be valid.')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin
);

//POST signup endpoint => /auth/signup
router.post(
    '/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject(
                            'E-Mail exists already, please pick a different one.'
                        );
                    }
                });
            })
            .normalizeEmail(),
        body(
            'password',
            'Please enter a password with only numbers and text and at least 5 characters.'
        )
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords must match!');
                }
                return true;
            })
    ],
    authController.postSignup
);

//POST logout endpoint => /auth/logout
router.post('/logout', authController.postLogout);

//GET reset endpoint => /auth/reset
router.get('/reset', authController.getReset);

//GET reset endpoint => /auth/reset/:token
router.get('/reset/:token', authController.getNewPassword);

//POST reset endpoint => /auth/reset
router.post('/reset', authController.postReset);

//POST new-password endpoint => /auth/new-password
router.post('/new-password', authController.postNewPassword);

module.exports = router;