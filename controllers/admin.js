const mongoose = require('mongoose');

const { validationResult } = require('express-validator/check');

const Activity = require('../models/activity');
const User = require('../models/user');
const MyTime = require('../models/myTime');
const { use } = require('../routes/admin');

// exports.getDashboard = (req, res, next) => {
//   //Fetch all the users registered in the application.
//   let tempTotalMinutes = 0;
//   let totalMinutes = 0;
//   let totalUserMinutes = 0;
//   //let theUsers = [];
//   User.find()
//     .then(users => {
//       //theUsers = users;
//       if (users.length > 0) {
//         users.forEach(user => {
//           user.populate('myHours.hours.hourId')
//             .execPopulate()
//             .then(u => {
//               u.myHours.hours.forEach(hr => {
//                 console.log('User time minutes: ' + hr.hourId.totalMinutes);
//                 totalUserMinutes += hr.hourId.totalMinutes;
//               })
//             })
//           tempTotalMinutes += totalUserMinutes;
//           console.log('TotalUserMinutes: ' + tempTotalMinutes);
//         });
//         //console.log(theUsers.length);
//         totalMinutes = tempTotalMinutes / 60;
//         //console.log('Total Minutes: ' + totalMinutes);
//         res.render('pages/admin/dashboard', {
//           users: users,
//           weekTotal: totalMinutes,
//           title: 'ASKAS | DASHBOARD',
//           path: '/adminDashboard'
//         });
//       } else {
//         res.render('pages/admin/dashboard', {
//           users: users,
//           weekTotal: totalMinutes,
//           title: 'ASKAS | DASHBOARD',
//           path: '/adminDashboard'
//         });
//       }
//     })
//     // .finally(users => {
//     //   console.log('This that: ' + theUsers.length);
//     //   //console.log('TempTotalMinutes: ' + totalUserMinutes);
//     // })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

exports.getDashboard = (req, res, next) => {
  //Fetch all the users registered in the application.
  let tempTotalMinutes = 0;
  let totalMinutes = 0;
  let totalUserMinutes = 0;
  User.find()
    .then(users => {
      //console.log(users);
      if (users.length > 0) {
        users.forEach(user => {
          user.populate('myHours.hours.hourId')
            .execPopulate()
            .then(u => {
              u.myHours.hours.forEach(hr => {
                totalUserMinutes += hr.hourId.totalMinutes;
              })
              console.log('TotalUserMinutes: ' + totalUserMinutes);
            })
          tempTotalMinutes += totalUserMinutes;
          console.log('Temp: ' + tempTotalMinutes);
        });
        totalMinutes = tempTotalMinutes / 60;
        console.log('Total Minutes: ' + totalMinutes);
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

// exports.getDashboard = (req, res, next) => {
//   function prepareDash() {
//     //Fetch all the users registered in the application.
//     User.find()
//       .then(users => {
//         //console.log(users);
//         let totalMin = 0;
//         let totalMinutes = 0;
//         let totalUserMinutes = 0;
//         if (users.length > 0) {
//           users.forEach(user => {
//             user.populate('myHours.hours.hourId')
//               .execPopulate()
//               .then(u => {
//                 u.myHours.hours.forEach(hr => {
//                   return totalUserMinutes += hr.hourId.totalMinutes;
//                 })
//                 //console.log('There: ' + totalUserMinutes / 60);
//               })
//             totalMin += totalUserMinutes;
//             console.log('Some: ' + totalMin);
//           });
//           totalMinutes = totalMin / 60;
//           console.log('Total Minutes: ' + totalMinutes);
//           res.render('pages/admin/dashboard', {
//             users: users,
//             weekTotal: totalMinutes,
//             title: 'ASKAS | DASHBOARD',
//             path: '/adminDashboard'
//           });
//         } else {
//           res.render('pages/admin/dashboard', {
//             users: users,
//             weekTotal: totalMinutes,
//             title: 'ASKAS | DASHBOARD',
//             path: '/adminDashboard'
//           });
//         }
//       })
//       .catch(err => {
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         return next(error);
//       });
//   }

//   async function getDash() {
//     await prepareDash();
//     console.log('There: ' + prepareDash)
//   }

//   getDash();
// };

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