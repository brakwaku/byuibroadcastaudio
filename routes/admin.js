const path = require('path');

const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


//POST dashboard endpoint => /admin/dashboard
router.get('/dashboard', isAuth, adminController.getDashboard);

//POST users/:userId endpoint => /admin/users/:userId
router.post('/users/:userId', isAuth, adminController.postUser);

//POST week/:weekId endpoint => /admin/week/:weekId
router.post('/week/:weekId', isAuth, adminController.postWeek);

//POST deleteUser/:userId endpoint => /admin/deleteUser/:userId
router.post('/deleteUser/:userId', isAuth, adminController.deleteUser);

//POST complete-year endpoint => /admin/week/:weekId
router.post('/complete-year', isAuth, adminController.completeYear);


module.exports = router;