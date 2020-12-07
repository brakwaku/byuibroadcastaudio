const mongoose = require('mongoose');

const { validationResult } = require('express-validator/check');

const Activity = require('../models/activity');
const User = require('../models/user');
const MyTime = require('../models/myTime');
const WeekTime = require('../models/weekTime');
const YearTime = require('../models/yearTime');
const { use } = require('../routes/admin');
const moment = require('moment');


/**********************************************
 * Endpoint for Admin dashboard
 ***********************************************/
exports.getDashboard = (req, res, next) => {
  //Fetch all the users registered in the application.
  var totalMinutes = 0;
  var totalYearMinutes = 0;
  var tempTotalMinutes = 0;
  var tempTotalYearMinutes = 0;
  User.find().sort([
    ['name', 'ascending']
  ])
    .then(users => {
      if (users.length > 0) {
        users.forEach(user => {
          user
            .populate('myHours.hours.hourId')
            .populate('weeklyHours.weekHours.weekHourId')
            .populate('yearlyHours.yearHours.yearHourId')
            .execPopulate()
            .then(u => {
              u.myHours.hours.forEach(hr => {
                tempTotalMinutes += hr.hourId.totalMinutes;
              })

              u.weeklyHours.weekHours.forEach(wh => {
                tempTotalYearMinutes += wh.weekHourId.totalMinutes;
              })
              //console.log('TotalUserMinutes: ' + tempTotalMinutes);
            })
        })

        // Not ideal but this delays the rest of the code from running for 1 sec
        setTimeout(function () {
          totalMinutes = tempTotalMinutes / 60;
          totalYearMinutes = tempTotalYearMinutes / 60;
          console.log('Total Minutes: ' + totalMinutes);
          res.render('pages/admin/dashboard', {
            users: users,
            weekTotal: totalMinutes,
            yearTotal: totalYearMinutes,
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
      // WeekTime.find()
      //   .then(weeks => {
      //     if (weeks.length > 0) {
      //       weeks.forEach(week => {
      //         tempTotalYearMinutes += week.totalMinutes;
      //       })
      //     }
      //   })
      // if (users.length > 0) {
      //   users.forEach(user => {
      //     user
      //       .populate('myHours.hours.hourId')
      //       .populate('weeklyHours.weekHours.weekHourId')
      //       .execPopulate()
      //       .then(u => {
      //         u.myHours.hours.forEach(hr => {
      //           tempTotalMinutes += hr.hourId.totalMinutes;
      //         })
      //         //console.log('TotalUserMinutes: ' + tempTotalMinutes);
      //       })
      //   });

      //   //Not ideal but this delays the rest of the code from running for 1sec
      //   setTimeout(function () {
      //     totalMinutes = tempTotalMinutes / 60;
      //     totalYearMinutes = tempTotalYearMinutes / 60;
      //     console.log('Total Minutes: ' + totalMinutes);
      //     res.render('pages/admin/dashboard', {
      //       users: users,
      //       weekTotal: totalMinutes,
      //       yearTotal: totalYearMinutes,
      //       title: 'ASKAS | DASHBOARD',
      //       path: '/adminDashboard'
      //     });
      //   }, 1000);
      // } else {
      //   res.render('pages/admin/dashboard', {
      //     users: users,
      //     weekTotal: totalMinutes,
      //     title: 'ASKAS | DASHBOARD',
      //     path: '/adminDashboard'
      //   });
      // }
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
    .populate('yearlyHours.yearHours.yearHourId')
    .then(dUser => {
      //console.log('Week: ' + dUser.weeklyHours.weekHours);
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


/********************************************************
 * Endpoint for ajax request to fetch and send selected
 * year's weeks' details
 ********************************************************/
exports.postYear = (req, res, next) => {
  const yearId = req.params.yearId;
  YearTime.findById(yearId)
    .populate('weekArray.weeks.yearTimeId')
    .then(dYear => {
      res.status(200).send(dYear);
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
exports.postDeleteUser = (req, res, next) => {

  //Get the user Id from the request params
  const userId = req.params.userId;

  if (req.user._id.toString() === userId.toString()) {
    return res.redirect('/admin/dashboard')
  }

  // // Find user and delete from the data base
  // User.findByIdAndDelete(userId)
  //   .then(deletedUser => {
  //     console.log('USER DELETED!');
  //     res.redirect('/admin/dashboard')
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });

  // Find user and change status to archived
  User.findById(userId)
    .then(archivedUser => {
      archivedUser.status = "archived";
      archivedUser.save();
      console.log(archivedUser.name + ' ARCHIVED!');
      res.status(200).send(archivedUser);
      //res.redirect('/admin/dashboard')
    })
    .catch(err => {
      console.log(err);
    });
}

/*******************************************************
 * Endpoint function for creating year document
 *******************************************************/
exports.postCompleteYear = (req, res, next) => {

  //Get the user Id from the request params
  const adminUserId = req.body.userId;

  // Variable to check if users have all submitted hours
  let checker = 0;

  // Initialize some properties of year object
  const dateEntered = moment().toDate();
  const year = moment().get('year');
  const yearStart = moment().startOf('year').format('MM/DD/YYYY');
  const yearEnd = moment().endOf('year').format('MM/DD/YYYY');
  let tempWeeks = [];
  let thisTMinutes = 0;


  // Fetch all users
  User.find()
    .then(users => {
      // Loop through and add all user hours array lengths
      users.forEach(iUser => {
        checker += iUser.myHours.hours.length;
      });

      if (checker > 0) {

        console.log('All not submitted');
        res.status(200).send(users);;

      } else {
        users.forEach(user => {
          const userId = user._id;
          user
            .populate('myHours.hours.hourId')
            .populate('weeklyHours.weekHours.weekHourId')
            .execPopulate()
            .then(theUser => {
              if (theUser.weeklyHours.weekHours.length > 0) {

                // Add all the total minutes of those weeks
                theUser.weeklyHours.weekHours.forEach(wh => {
                  thisTMinutes += wh.weekHourId.totalMinutes;

                  // While looping, add the _id property of the week object to the array
                  tempWeeks.push({
                    yearTimeId: wh.weekHourId._id
                  })
                })

                // Assign total minutes value to result from loop
                const theTotalMinutes = thisTMinutes;

                // Assign this array to result from loop
                const tempWeekArray = tempWeeks;

                // Assign variable to object containing array
                const updatedWeekArray = {
                  weeks: tempWeekArray
                };

                // Create new Year object
                const myYear = new YearTime({
                  dateEntered: dateEntered,
                  yearStart: yearStart,
                  yearEnd: yearEnd,
                  yearNumber: year,
                  totalMinutes: theTotalMinutes,
                  weekArray: updatedWeekArray,
                  userId: userId
                });

                //Save new Year object as object in DB
                myYear
                  .save()
                  .then(year => {
                    // res.status(200).send(result);

                    //Empty user's weeklyHours array
                    theUser.weeklyHours.weekHours = [];

                    console.log('YEAR CREATED!');

                    //Add the year's ID to the user model
                    return theUser.addToYearlyHours(year._id);
                  })
                  .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                  });
              }

            })
            .catch(err => {
              const error = new Error(err);
              error.httpStatusCode = 500;
              return next(error);
            });
        })

        res.status(200).send(users);
      }
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}