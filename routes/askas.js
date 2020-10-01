const path = require('path');

const express = require('express');

const askasController = require('../controllers/askas');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/dashboard', isAuth, askasController.getDashboard)
router.get('/contact', askasController.getContact)
router.get('/about', askasController.getAbout)
router.get('/tasks', isAuth, askasController.getTasks)
router.get('/edit-time/:timeId', isAuth, askasController.getEditTime)
router.post('/myHours', isAuth, askasController.postHours)
router.post('/update-time', isAuth, askasController.postEditTime)
router.post('/calculateWeek', isAuth, askasController.postCalculateWeek)

module.exports = router;