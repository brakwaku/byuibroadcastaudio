const path = require('path');

const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/dashboard => GET
router.get('/dashboard', isAuth, adminController.getDashboard);

//router.get('/users/:userId', isAuth, adminController.getUser);
router.post('/users/:userId', isAuth, adminController.postUser);


module.exports = router;