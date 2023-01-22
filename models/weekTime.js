const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const weekTimeSchema = new Schema({
  dateEntered: {
    type: Date,
    required: true
  },
  weekStart: {
    type: Date,
    required: true
  },
  weekEnd: {
    type: Date,
    required: true
  },
  weekNumber: {
    type: Number,
    required: true
  },
  totalMinutes: {
    type: Number,
    required: true
  },
  timeArray: {
    times: [
      {
        weekTimeId: {
          type: Schema.Types.ObjectId,
          ref: 'MyTime',
          required: true
        }
      }
    ]
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('WeekTime', weekTimeSchema);