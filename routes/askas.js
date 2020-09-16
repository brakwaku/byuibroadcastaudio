const path = require('path');

const express = require('express');

const askasController = require('../controllers/askas');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/dashboard', isAuth, askasController.getDashboard)
// router.get('/predashboard', isAuth, askasController.postPostHours)
router.get('/contact', askasController.getContact)
router.get('/about', askasController.getAbout)
router.get('/tasks', isAuth, askasController.getTasks)
router.get('/edit-time/:timeId', isAuth, askasController.getEditTime)
router.get('/motivation', isAuth, askasController.getMotivation)
router.post('/bucket', isAuth, askasController.postBucket)
router.post('/create-toDo', isAuth, askasController.postToDo)
router.post('/toDo-delete', isAuth, askasController.postToDoDelete)
router.post('/completed', isAuth, askasController.postCompleted)
router.post('/archive', isAuth, askasController.postArchive)
router.post('/archives', isAuth, askasController.postUserArchives)
router.post('/user-idea', isAuth, askasController.postUserIdea)
router.post('/myHours', isAuth, askasController.postHours)
router.post('/update-time', isAuth, askasController.postEditTime)

module.exports = router;