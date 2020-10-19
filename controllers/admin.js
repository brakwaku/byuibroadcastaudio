const mongoose = require('mongoose');

const { validationResult } = require('express-validator/check');

const Activity = require('../models/activity');
const User = require('../models/user');
const MyTime = require('../models/myTime');
const WeekTime = require('../models/weekTime');
const { use } = require('../routes/admin');


/**********************************************
 * Endpoint for Admin dashboard
 ***********************************************/
exports.getDashboard = (req, res, next) => {
  //Fetch all the users registered in the application.
  var totalMinutes = 0;
  var tempTotalMinutes = 0;
  User.find().sort([
    ['name', 'ascending']
  ])
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
              //console.log('TotalUserMinutes: ' + tempTotalMinutes);
            })
        });

        //Not ideal but this delays the rest of the code from running for 1sec
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


/********************************************************
 * Endpoint for ajax request to fetch and send selected
 * user's work details
 ********************************************************/
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


/********************************************************
 * Endpoint for ajax request to fetch and send selected
 * week's hours details
 ********************************************************/
exports.postWeek = (req, res, next) => {
  const weekId = req.params.weekId;
  WeekTime.findById(weekId)
    .populate('timeArray.times.weekTimeId')
    .then(dWeek => {
      //console.log(dWeek.timeArray.times);
      res.status(200).send(dWeek);
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

/*******************************************************
 * Endpoint function for ajax request to delete a user
 *******************************************************/
exports.deleteUser = (req, res, next) => {

  //Get the user Id from the request params
  const userId = req.params.userId;

  //Find user and elete from the data base
  User.findByIdAndDelete(userId)
    .then(deletedUser => {
      console.log('USER DELETED!');
      res.redirect('/admin/dashboard')
    })
    .catch(err => {
      console.log(err);
    });
}