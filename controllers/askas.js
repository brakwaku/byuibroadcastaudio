const Activity = require('../models/activity');
const User = require('../models/user');
const MyTime = require('../models/myTime');
const WeekTime = require('../models/weekTime');
const nodemailer = require('nodemailer');
const moment = require('moment');
const currentWeekNumber = require('current-week-number');
const { min } = require('moment');
const { validationResult } = require('express-validator/check');


exports.getContact = (req, res, next) => {
    return res.render('pages/askas/contact', {
        title: 'ASKAS | Contact',
        path: '/contact'
    });
};

exports.getAbout = (req, res, next) => {
    return res.render('pages/askas/about', {
        title: 'ASKAS | About Us',
        path: '/about'
    });
};

exports.getTasks = (req, res, next) => {
    Activity.find()
        .then(activities => {
            console.log('Activitiess: ' + activities);
            res.render('pages/askas/tasks', {
                acts: activities,
                title: 'ASKAS | Tasks',
                path: '/tasks'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getDashboard = (req, res, next) => {
    let tMin = 0; //initialize variable for total minutes
    let uMin = 0; //initialize variable for user minutes
    let uHrs = 0; //initialize variable for user hours
    req.user
        .populate('bucket.items.activityId')
        .populate('toDoList.toDos.toDoId')
        .populate('completed.comps.compId')
        .populate('archive.archs.archId')
        .populate('myHours.hours.hourId')
        .execPopulate()
        .then(user => {
            user.myHours.hours.forEach(h => {
                tMin += h.hourId.totalMinutes;
            })
            uMin = tMin % 60; //Calculate number of minutes after hours
            uHrs = tMin / 60; //Convert total minutes to hours
            res.render('pages/askas/dashboard', {
                path: '/dashboard',
                title: 'ASKAS | Dashboard',
                toDos: user.toDoList.toDos,
                activities: user.bucket.items,
                comps: user.completed.comps,
                archs: user.archive.archs,
                hrs: user.myHours.hours,
                uHrs: uHrs
            });
            console.log('Total mins: ' + tMin);
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postHours = (req, res, next) => {
    const startTime = req.body.startTime;
    const manDate = moment(req.body.manDate, "YYYY-MM-DD", true).toDate();
    const endTime = req.body.endTime;
    const taskDescription = req.body.taskDescription;
    const comments = req.body.comments;
    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('../views/pages/askas/dashboard', {
            title: 'ASKAS | DASHBOARD',
            path: '/askas/dashboard',
            hrs: user.myHours.hours
        });
    }
    let timeStart = new Date("01/01/2007 " + startTime);
    let timeEnd = new Date("01/01/2007 " + endTime);

    let totalMinutes = (timeEnd - timeStart) / 60000; //dividing by seconds and milliseconds

    let minute = totalMinutes % 60;
    let hour = (totalMinutes - minute) / 60;

    let weekTotal = 0;

    const now = moment().toDate();

    const myHours = new MyTime({
        totalMinutes: totalMinutes,
        startTime: startTime,
        endTime: endTime,
        minutes: minute,
        hours: hour,
        dateEntered: now,
        manualDate: manDate,
        taskDescription: taskDescription,
        comments: comments,
        userId: req.user
    });
    myHours
        .save()
        .then(result => {
            return req.user.addToMyHours(result._id);
        })
        // .then(result => {
        //     req.user.myHours.hours.forEach(thisHour => {
        //         console.log('Date entered: ' + thisHour);

        //         //weekTotal += thisHour._Id.totalMinutes;

        //         // if (startOfWeek.isSameOrAfter(thisHour._Id.dateEntered.toDate()) || endOfWeek.isSame(thisHour._Id.dateEntered.toDate())) {

        //         // }
        //         //console.log('Week total: ' + weekTotal);
        //     });
        // })
        .then(result => {
            res.redirect('/askas/dashboard');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

    // console.log('Start time: ' + startTime + ' ' + 'End time: ' + endTime)
    // console.log('Hours: ' + hour)
    // console.log('Minutes: ' + minute)
    // console.log('Total minutes: ' + totalMinutes)
    // console.log('Start of week: ' + startOfWeek)
    // console.log('End of week: ' + endOfWeek)
    // console.log('Date now: ' + now)
    // console.log('Manual date now: ' + manDate.toString())
    console.log('Time Created')
}

exports.getEditTime = (req, res, next) => {
    const timeId = req.params.timeId;
    console.log('Time Id here: ' + timeId)
    MyTime.findById(timeId)
        .then(thisTime => {
            console.log('Time object: ' + thisTime)
            res.status(200).send(thisTime);
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};


exports.postEditTime = (req, res, next) => {
    const updatedStartTime = req.body.startTime;
    const updatedManDate = req.body.manDate;
    const updatedEndTime = req.body.endTime;
    const updatedTaskDescription = req.body.taskDescription;
    const updatedComments = req.body.comments;
    const timeId = req.body.timeId;

    let timeStart = new Date("01/01/2007 " + updatedStartTime);
    let timeEnd = new Date("01/01/2007 " + updatedEndTime);

    let totalMinutes = (timeEnd - timeStart) / 60000; //dividing by seconds and milliseconds

    let updatedMinute = totalMinutes % 60;
    let updatedHour = (totalMinutes - updatedMinute) / 60;

    let weekTotal = 0;

    //const now = moment().toDate();

    MyTime.findById(timeId)
        .then(thisTime => {
            if (thisTime.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/askas/dashboard');
            }
            thisTime.totalMinutes = totalMinutes;
            thisTime.startTime = updatedStartTime;
            thisTime.endTime = updatedEndTime;
            thisTime.minutes = updatedMinute;
            thisTime.hours = updatedHour;
            //thisTime.dateEntered = updatednow;
            thisTime.manualDate = updatedManDate;
            thisTime.taskDescription = updatedTaskDescription;
            thisTime.comments = updatedComments;
            return thisTime.save().then(result => {
                console.log('UPDATED TIME!');
                res.redirect('/askas/dashboard');
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postCalculateWeek = (req, res, next) => {
    const userId = req.user._id;
    const startOfWeek = moment().startOf('week').toDate();
    const endOfWeek = moment().endOf('week').toDate();
    const dateEntered = moment().toDate();
    const weekNumber = currentWeekNumber(dateEntered);
    const myNow = moment().toDate();
    let tempHours = [];
    let tMinutes = 0;
    req.user
        .populate('myHours.hours.hourId')
        .execPopulate()
        .then(user => {
            tempHours = [...user.myHours.hours];
            user.myHours.hours.forEach(h => {
                console.log('Single Mins: ' + h.hourId.totalMinutes);
                tMinutes += h.hourId.totalMinutes;
            })
            console.log('Temp: ' + tempHours);
            const recordedHours = tempHours;
            const totalMinutes = tMinutes;

            console.log('Total Mins: ' + totalMinutes);


            if (myNow != endOfWeek) {
                const myWeek = new WeekTime({
                    dateEntered: dateEntered,
                    weekStart: startOfWeek,
                    weekEnd: endOfWeek,
                    weekNumber: weekNumber,
                    totalMinutes: totalMinutes,
                    userId: userId
                });
                myWeek.timeArray.push({
                    weekTimeId: recordedHours
                });
                myWeek
                    .save()
                    .then(result => {
                        res.status(200).send(result);
                        req.user.myHours.hours = [];
                        return req.user.addToWeeklyHours(result._id);
                    })
                    .catch(err => {
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        return next(error);
                    });
                console.log('Week created');
                // console.log('End of week: ' + endOfWeek);
                // console.log('Time now: ' + moment().toDate());
            }
        })

    console.log('User Id (Calc week): ' + userId);
};