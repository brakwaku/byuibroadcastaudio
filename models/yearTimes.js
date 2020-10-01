const mongoose = require('mongoose');
//const User = require('./user');

const Schema = mongoose.Schema;

const yearTimeSchema = new Schema({
  dateEntered: {
    type: Date,
    required: true
  },
  dayStart: {
    type: Date,
    required: true
  },
  dayEnd: {
    type: Date,
    required: true
  },
//   weekNumber: {
//     type: Number,
//     required: true
//   },
  totalMinutes: {
    type: Number,
    required: true
  },
  weekArray: [
    {
      yearTimeId: [
        {
          type: Schema.Types.ObjectId,
          ref: 'WeekTime',
          required: true
        }
      ]
    }
  ],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('YearTime', yaerTimeSchema);