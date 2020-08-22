const mongoose = require('mongoose');

const { validationResult } = require('express-validator/check');

const Activity = require('../models/activity');

exports.getAddActivity = (req, res, next) => {
  res.render('../views/pages/admin/edit-activity', {
    title: 'C9FL | Add Activity',
    path: '/admin/add-activity',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddActivity = (req, res, next) => {
  const reqTitle = req.body.title;
  const description = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('../views/pages/admin/edit-activity', {
      title: 'C9FL | Add Activity',
      path: '/admin/add-activity',
      editing: false,
      hasError: true,
      activity: {
        title: reqTitle,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const activity = new Activity({
    title: reqTitle,
    description: description,
    userId: req.user
  });
  activity
    .save()
    .then(result => {
      console.log('Created Activity');
      res.redirect('/admin/activities');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditActivity = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/admin/activities');
  }
  const actId = req.params.activityId;
  Activity.findById(actId)
    .then(activity => {
      if (!activity) {
        return res.redirect('/admin/activities');
      }
      res.render('pages/admin/edit-activity', {
        title: 'C9FL | Edit Activity',
        path: '/admin/edit-activity',
        editing: editMode,
        activity: activity,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditActivity = (req, res, next) => {
  const actId = req.body.activityId;
  const updatedTitle = req.body.title;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('../views/pages/admin/edit-activity', {
      title: 'C9FL | Edit Activity',
      path: '/admin/edit-activity',
      editing: true,
      hasError: true,
      activity: {
        title: updatedTitle,
        description: updatedDesc,
        _id: actId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Activity.findById(actId)
    .then(activity => {
      if (activity.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/admin/activities');
      }
      activity.title = updatedTitle;
      activity.description = updatedDesc;
      return activity.save().then(result => {
        console.log('UPDATED ACTIVITY!');
        res.redirect('/mad/activities');
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getActivities = (req, res, next) => {
  Activity.find({ userId: req.user._id })
    .then(activities => {
      console.log(activities);
      res.render('pages/admin/activities', {
        acts: activities,
        title: 'C9FL | Admin',
        path: '/adminActivities'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteActivity = (req, res, next) => {
  const actId = req.body.activityId;
  Activity.deleteOne({ _id: actId, userId: req.user._id })
    .then(() => {
      console.log('DESTROYED ACTIVITY');
      res.redirect('/admin/activities');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
