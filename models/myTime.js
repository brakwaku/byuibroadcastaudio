const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const myTimeSchema = new Schema({
  totalMinutes: {
    type: Number,
    required: true
  },
  minutes: {
    type: Number,
    required: true
  },
  hours: {
    type: Number,
    required: true
  },
  dateEntered: {
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('MyTime', myTimeSchema);