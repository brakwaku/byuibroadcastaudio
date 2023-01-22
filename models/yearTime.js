const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const yearTimeSchema = new Schema({
  dateEntered: {
    type: Date,
    required: true
  },
  yearStart: {
    type: Date,
    required: true
  },
  yearEnd: {
    type: Date,
    required: true
  },
  yearNumber: {
    type: Number,
    required: true
  },
  totalMinutes: {
    type: Number,
    required: true
  },
  weekArray: {
    weeks: [
      {
        yearTimeId: {
          type: Schema.Types.ObjectId,
          ref: 'WeekTime',
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

module.exports = mongoose.model('YearTime', yearTimeSchema);