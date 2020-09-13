const Activity = require('../models/activity');
const User = require('../models/user');
const MyTime = require('../models/myTime');
const nodemailer = require('nodemailer');
const moment = require('moment');
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

exports.getMotivation = (req, res, next) => {
    return res.render('pages/askas/motivation', {
        title: 'ASKAS | Motivation',
        path: '/motivation'
    });
};

exports.getActivities = (req, res, next) => {
    Activity.find()
        .then(activities => {
            console.log('Activitiess: ' + activities);
            res.render('pages/askas/activities', {
                acts: activities,
                title: 'ASKAS | Activities',
                path: '/activities'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getActivity = (req, res, next) => {
    const actId = req.params.activityId;
    Activity.findById(actId)
        .then(activity => {
            res.render('pages/askas/activity-detail', {
                activity: activity,
                title: 'ASKAS | ' + activity.title,
                path: '/activities'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getIndex = (req, res, next) => {
    Activity.find()
        .then(activities => {
            res.render('pages/askas/activities', {
                title: 'ASKAS | Activities',
                acts: activities,
                path: '/activities'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postBucket = (req, res, next) => {
    const actId = req.body.activityId;
    Activity.findById(actId)
        .then(activity => {
            return req.user.addToBucket(activity);
        })
        .then(result => {
            console.log('Postbucket result: ' + result);
            res.redirect('activities');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postBucketDeleteActivity = (req, res, next) => {
    const actId = req.body.activityId;
    req.user
        .removeFromBucket(actId)
        .then(result => {
            res.redirect('dashboard');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postToDoDeleteActivity = (req, res, next) => {
    const actId = req.body.activityId;
    req.user
        .removeFromBucket(actId)
        .then(result => {
            res.redirect('dashboard');
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

exports.postToDo = (req, res, next) => {
    const toDoId = req.body.activityId;
    req.user.addToToDo(toDoId)
        .then(() => {
            return req.user.removeFromBucket(toDoId);
        })
        .then(() => {
            res.redirect('dashboard');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postToDoDelete = (req, res, next) => {
    const toDoId = req.body.toDoId;
    req.user.removeFromToDo(toDoId)
        .then(result => {
            res.redirect('dashboard');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postCompleted = (req, res, next) => {
    const compId = req.body.toDoId;
    req.user.addToCompleted(compId)
        .then(() => {
            return req.user.removeFromToDo(compId);
        })
        .then(() => {
            res.redirect('dashboard');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postArchive = (req, res, next) => {
    const archId = req.body.compId;
    req.user.addToArchive(archId)
        .then(() => {
            return req.user.removeFromCompleted(archId);
        })
        .then(() => {
            res.redirect('dashboard');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postUserIdea = (req, res, next) => {
    const ideaName = req.body.ideaName;
    const ideaDesc = req.body.ideaDesc;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'myc9forlife@gmail.com',
            pass: 'CnineForLife'
        }
    });
    const mailOptions = {
        from: req.body.userEmail,
        to: 'myc9forlife@gmail.com',
        subject: 'Activity idea',
        html: `
            <h5>Hello, can you please add this activity to the list?</5>
            <p>Name: ${ideaName}</p>
            <p>Description: ${ideaDesc}</p>
          `
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    return res.redirect('activities');
    console.log(ideaDesc + ' ' + ideaName)
}

exports.postUserArchives = (req, res, next) => {
    req.user
        .populate('archive.archs.archId')
        .execPopulate()
        .then(user => {
            res.render('pages/askas/archives', {
                path: '/archives',
                title: 'ASKAS | Archives',
                archs: user.archive.archs
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postHours = (req, res, next) => {
    const startTime = req.body.startTime;
    const manDate = req.body.manDate;
    const endTime = req.body.endTime;
    const taskDescription = req.body.taskDescription;
    const comments = req.body.comments;
    const errors = validationResult(req);
    const startOfWeek = moment().startOf('week').toDate();
    const endOfWeek = moment().endOf('week').toDate();


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
            //console.log(hourId);
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

    console.log(startTime + ' ' + endTime)
    console.log('Hours: ' + hour)
    console.log('Minutes: ' + minute)
    console.log('Total minutes: ' + totalMinutes)
    console.log('Start of week: ' + startOfWeek)
    console.log('End of week: ' + endOfWeek)
    console.log(now)
}