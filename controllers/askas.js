const Activity = require('../models/activity');
const User = require('../models/user');
const MyTime = require('../models/myTime');
const WeekTime = require('../models/weekTime');
const nodemailer = require('nodemailer');
const moment = require('moment');
const currentWeekNumber = require('current-week-number');
const { min } = require('moment');
const { validationResult } = require('express-validator/check');


/********************************************************
 * Endpoint function for request to contact page
 ********************************************************/
exports.getContact = (req, res, next) => {
    return res.render('pages/askas/contact', {
        title: 'ASKAS | Contact',
        path: '/contact'
    });
};


/********************************************************
 * Endpoint function for request to About page
 ********************************************************/
exports.getAbout = (req, res, next) => {
    return res.render('pages/askas/about', {
        title: 'ASKAS | About Us',
        path: '/about'
    });
};


/********************************************************
 * Endpoint function for request to Tasks page
 ********************************************************/
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


/********************************************************
 * Endpoint function for request to regular user's dashboard
 ********************************************************/
exports.getDashboard = (req, res, next) => {
    
    if (req.user.role === 'admin') {
        res.redirect('/admin/dashboard');
    } else {
        let tMin = 0; //initialize variable for total minutes
        let uMin = 0; //initialize variable for user minutes
        let uHrs = 0; //initialize variable for user hours
        req.user
            .populate('myHours.hours.hourId')
            .populate('weeklyHours.weekHours.weekHourId')
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
                    hrs: user.myHours.hours,
                    weekHrs: user.weeklyHours.weekHours,
                    uHrs: uHrs
                });
                console.log('Total mins: ' + tMin);
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    }
};


/********************************************************
 * Endpoint function for request to record user's time
 ********************************************************/
exports.postHours = (req, res, next) => {
    const startTime = req.body.startTime;
    const manDate = moment(req.body.manDate, "YYYY-MM-DD", true).toDate(); //Does not work on Safari on mac currently 09/07/2020
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

    const now = moment().toDate();

    //Create new time object
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
        .save() //Save new time object as document in DB
        .then(result => {
            return req.user.addToMyHours(result._id);
        })
        .then(result => {
            res.redirect('/askas/dashboard');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

    console.log('Time Created')
}


/*****************************************************************
 * Endpoint function for ajax request to edit selected time object
 * It finds the document by its ID and sends it back to user
 *****************************************************************/
exports.getEditTime = (req, res, next) => {
    const timeId = req.params.timeId;

    MyTime.findById(timeId)
        .then(thisTime => {
            res.status(200).send(thisTime);
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};


/**********************************************************
 * Endpoint function for request to save changes to user's
 * edited time
 **********************************************************/
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
            thisTime.manualDate = updatedManDate;
            thisTime.taskDescription = updatedTaskDescription;
            thisTime.comments = updatedComments;
            return thisTime.save().then(result => {
                //console.log('UPDATED TIME!');
                res.redirect('/askas/dashboard');
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};


/********************************************************
 * Endpoint function for request to record user's time
 ********************************************************/
exports.postCalculateWeek = (req, res, next) => {
    const userId = req.user._id;
    const startOfWeek = moment().startOf('week').toDate();
    const endOfWeek = moment().endOf('week').toDate();
    const dateEntered = moment().toDate();
    const weekNumber = currentWeekNumber(dateEntered);
    let tempHours = [];
    let tMinutes = 0;
    req.user
        .populate('myHours.hours.hourId') //Fetch atual object from the myTime model
        .execPopulate()
        .then(user => {
            if (user.myHours.hours.length > 0) {
                user.myHours.hours.forEach(h => {
                    tMinutes += h.hourId.totalMinutes;

                    //while looping add the _id property of the time object to the array
                    tempHours.push({
                        weekTimeId: h.hourId._id
                    })
                })
                //console.log('Temp: ' + tempHours);

                //Assign total minutes value
                const totalMinutes = tMinutes;

                //Assign this array to results from the loop
                const tempTimeArray = tempHours;

                //Assign variable to object
                const updateTimeArray = {
                    times: tempTimeArray
                };

                //console.log('Total Mins: ' + totalMinutes);

                //Create new Week object
                const myWeek = new WeekTime({
                    dateEntered: dateEntered,
                    weekStart: startOfWeek,
                    weekEnd: endOfWeek,
                    weekNumber: weekNumber,
                    totalMinutes: totalMinutes,
                    timeArray: updateTimeArray,
                    userId: userId
                });

                //Save new Week object as document in DB
                myWeek
                    .save()
                    .then(result => {
                        // res.status(200).send(result);
                        //console.log('WEEK CREATED!');

                        //Empty user's hours array
                        req.user.myHours.hours = [];

                        //Add the week's ID to the user model
                        return req.user.addToWeeklyHours(result._id);
                    })
                    .then(result => {
                        //res.status(200).send(result);
                        return res.redirect('/askas/dashboard');
                    })
                    .catch(err => {
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        return next(error);
                    });
                // console.log('End of week: ' + endOfWeek);
                // console.log('Time now: ' + moment().toDate());

            } else {
                console.log('No week created')
                res.redirect('/askas/dashboard');
                return res.status(200).send();
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
 * week's hours' details
 ********************************************************/
exports.postGetWeek = (req, res, next) => {
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