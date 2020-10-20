const path = require('path');

const express = require('express');

const askasController = require('../controllers/askas');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//GET dashboard endpoint => /askas/dashboard
router.get('/dashboard', isAuth, askasController.getDashboard)

//GET contact endpoint => /askas/contact
router.get('/contact', askasController.getContact)

//GET about endpoint => /askas/about
router.get('/about', askasController.getAbout)

//GET tasks endpoint => /askas/tasks
//router.get('/tasks', isAuth, askasController.getTasks)

//GET edit-time endpoint => /askas/edit-time/:timeId
router.get('/edit-time/:timeId', isAuth, askasController.getEditTime)

//POST myHours endpoint => /askas/myHours
router.post('/myHours', isAuth, askasController.postHours)

//POST update-time endpoint => /askas/update-time
router.post('/update-time', isAuth, askasController.postEditTime)

//POST calculateWeek endpoint => /askas/calculateWeek
router.post('/calculateWeek', isAuth, askasController.postCalculateWeek)

//POST week/:weekId endpoint => /askas/week/:weekId
router.post('/week/:weekId', isAuth, askasController.postGetWeek)

module.exports = router;