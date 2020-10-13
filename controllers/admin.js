const mongoose = require('mongoose');

const { validationResult } = require('express-validator/check');

const Activity = require('../models/activity');
const User = require('../models/user');
const MyTime = require('../models/myTime');
const { use } = require('../routes/admin');

exports.getDashboard = (req, res, next) => {
  //Fetch all the users registered in the application.
  var totalMinutes = 0;
  var tempTotalMinutes = 0;
  User.find()
    .then(users => {
      //console.log(users);
      if (users.length > 0) {
        users.forEach(user => {
          user.populate('myHours.hours.hourId')
            .execPopulate()
            .then(u => {
              u.myHours.hours.forEach(hr => {
                tempTotalMinutes += hr.hourId.totalMinutes;
              })
              console.log('TotalUserMinutes: ' + tempTotalMinutes);
            })
        });

        //Not ideal but this delays the rest of the code from running
        setTimeout(function () {
          totalMinutes = tempTotalMinutes / 60;
          console.log('Total Minutes: ' + totalMinutes);
          res.render('pages/admin/dashboard', {
            users: users,
            weekTotal: totalMinutes,
            title: 'ASKAS | DASHBOARD',
            path: '/adminDashboard'
          });
        }, 1000);
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
  User.findById(userId)
    .populate('myHours.hours.hourId')
    .populate('weeklyHours.weekHours.weekHourId')
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

exports.postWeek = (req, res, next) => {
  const userId = req.params.weekId;
  User.findById(weekId)
    // .populate('myHours.hours.hourId')
    .populate('timeArray.weekTimeId')
    .then(dWeek => {
      res.status(200).send(dWeek);
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  //console.log('User Id: ' + userId)
};