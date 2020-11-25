const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  role: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: false
  },
  myHours: {
    hours: [
      {
        hourId: {
          type: Schema.Types.ObjectId,
          ref: 'MyTime',
          required: true
        }
      }
    ]
  },
  weeklyHours: {
    weekHours: [
      {
        weekHourId: {
          type: Schema.Types.ObjectId,
          ref: 'WeekTime',
          required: true
        }
      }
    ]
  },
  yearlyHours: {
    yearHours: [
      {
        yearHourId: {
          type: Schema.Types.ObjectId,
          ref: 'YearTime',
          required: true
        }
      }
    ]
  },
  bucket: {
    items: [
      {
        activityId: {
          type: Schema.Types.ObjectId,
          ref: 'Activity',
          required: true
        },
      }
    ]
  },
  toDoList: {
    toDos: [
      {
        toDoId: {
          type: Schema.Types.ObjectId,
          ref: 'Activity',
          required: true
        }
      }
    ]
  },
  completed: {
    comps: [
      {
        compId: {
          type: Schema.Types.ObjectId,
          ref: 'Activity',
          required: true
        }
      }
    ]
  },
  archive: {
    archs: [
      {
        archId: {
          type: Schema.Types.ObjectId,
          ref: 'Activity',
          required: true
        }
      }
    ]
  }
});

userSchema.methods.addToMyHours = function (hour) {
  const updatedHourItems = [...this.myHours.hours];

  updatedHourItems.push({
    hourId: hour
  });

  const updatedHour = {
    hours: updatedHourItems
  };
  this.myHours = updatedHour;
  return this.save();
};

userSchema.methods.addToWeeklyHours = function (weekId) {
  const updatedWeekHourItems = [...this.weeklyHours.weekHours];

  updatedWeekHourItems.push({
      weekHourId: weekId
    });
  const updatedWeekHour = {
    weekHours: updatedWeekHourItems
  };
  this.weeklyHours = updatedWeekHour;
  return this.save();
};

userSchema.methods.addToYearlyHours = function (yearId) {
  const updatedYearHourItems = [...this.yearlyHours.yearHours];

  updatedYearHourItems.push({
      yearHourId: yearId
    });
  const updatedYearHour = {
    yearHours: updatedYearHourItems
  };
  this.yearlyHours = updatedYearHour;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
