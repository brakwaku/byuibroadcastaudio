const mongoose = require('mongoose');

const { validationResult } = require('express-validator/check');

const Activity = require('../models/activity');
const User = require('../models/user');
const MyTime = require('../models/myTime');
const { use } = require('../routes/admin');

exports.getDashboard = (req, res, next) => {
  User.find()
    .then(users => {
      //console.log(users);
      let totalMin = 0;
      let totalMinutes = 0;
      if (users.length > 0) {
        users.forEach(user => {
          //console.log(user);
          user
            .populate('myHours.hours.hourId')
            .execPopulate()
          .then(usss => {
            console.log('Thing Up: ' + usss.myHours.hours.hourId);
          })
          .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
          console.log('Thing: ' + user.myHours.hours);
          user.myHours.hours.forEach(u => {
            //console.log('Thing: ' + user.myHours);
            totalMin += u.hourId.totalMinutes;
          });
        });
        totalMinutes = totalMin / 60;
        res.render('pages/admin/dashboard', {
          users: users,
          weekTotal: totalMinutes,
          title: 'ASKAS | DASHBOARD',
          path: '/adminDashboard'
        });
      } else {
        res.render('pages/admin/dashboard', {
          users: users,
          weekTotal: totalMinutes,
          title: 'ASKAS | DASHBOARD',
          path: '/adminDashboard'
        });
      }
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId).populate('myHours.hours.hourId')
    .then(dUser => {
      res.status(200).send(dUser);
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  //console.log('User Id: ' + userId)
};