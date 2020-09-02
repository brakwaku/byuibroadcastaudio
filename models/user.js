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

userSchema.methods.addToToDo = function (activity) {
  const toDoActivityIndex = this.toDoList.toDos.findIndex(cp => {
    return cp.toDoId.toString() === activity.toString();
  });
  let newQuantity = 1;
  const updatedToDoItems = [...this.toDoList.toDos];

  if (toDoActivityIndex >= 0) {
    newQuantity = this.toDoList.toDos[toDoActivityIndex].quantity + 1;
    updatedToDoItems[toDoActivityIndex].quantity = newQuantity;
  } else {
    updatedToDoItems.push({
      toDoId: activity,
      quantity: newQuantity
    });
  }
  const updatedToDo = {
    toDos: updatedToDoItems
  };
  this.toDoList = updatedToDo;
  return this.save();
};

userSchema.methods.removeFromToDo = function (toDoId) {
  const updatedToDoItems = this.toDoList.toDos.filter(toDo => {
    return toDo.toDoId.toString() !== toDoId.toString();
  });
  this.toDoList.toDos = updatedToDoItems;
  return this.save();
};

userSchema.methods.addToCompleted = function (activityId) {
  const compActivityIndex = this.completed.comps.findIndex(cp => {
    return cp.compId.toString() === activityId.toString();
  });
  let newQuantity = 1;
  const updatedCompItems = [...this.completed.comps];

  if (compActivityIndex >= 0) {
    newQuantity = this.completed.comps[compActivityIndex].quantity + 1;
    updatedCompItems[compActivityIndex].quantity = newQuantity;
  } else {
    updatedCompItems.push({
      compId: activityId,
      quantity: newQuantity
    });
  }
  const updatedComp = {
    comps: updatedCompItems
  };
  this.completed = updatedComp;
  return this.save();
};

userSchema.methods.removeFromCompleted = function (compId) {
  const updatedCompItems = this.completed.comps.filter(comp => {
    return comp.compId.toString() !== compId.toString();
  });
  this.completed.comps = updatedCompItems;
  return this.save();
};

userSchema.methods.addToArchive = function (activity) {
  const archActivityIndex = this.archive.archs.findIndex(cp => {
    return cp.archId.toString() === activity.toString();
  });
  let newQuantity = 1;
  const updatedArchItems = [...this.archive.archs];

  if (archActivityIndex >= 0) {
    newQuantity = this.archive.archs[archActivityIndex].quantity + 1;
    updatedArchItems[archActivityIndex].quantity = newQuantity;
  } else {
    updatedArchItems.push({
      archId: activity,
      quantity: newQuantity
    });
  }
  const updatedArch = {
    archs: updatedArchItems
  };
  this.archive = updatedArch;
  return this.save();
};

userSchema.methods.addToBucket = function (activity) {
  const bucketActivityIndex = this.bucket.items.findIndex(cp => {
    return cp.activityId.toString() === activity._id.toString();
  });
  let newQuantity = 1;
  const updatedBucketItems = [...this.bucket.items];

  if (bucketActivityIndex >= 0) {
    newQuantity = this.bucket.items[bucketActivityIndex].quantity + 1;
    updatedBucketItems[bucketActivityIndex].quantity = newQuantity;
  } else {
    updatedBucketItems.push({
      activityId: activity._id,
      quantity: newQuantity
    });
  }
  const updatedBucket = {
    items: updatedBucketItems
  };
  this.bucket = updatedBucket;
  return this.save();
};

userSchema.methods.removeFromBucket = function (activityId) {
  const updatedBucketItems = this.bucket.items.filter(item => {
    return item.activityId.toString() !== activityId.toString();
  });
  this.bucket.items = updatedBucketItems;
  return this.save();
};

userSchema.methods.clearBucket = function () {
  this.bucket = { items: [] };
  return this.save();
};

userSchema.methods.addToMyHours = function (hour) {
  const dailyHourIndex = this.myHours.hours.findIndex(cp => {
    return cp.hourId.toString() === hour.toString();
  });
  let newQuantity = 1;
  const updatedHourItems = [...this.myHours.hours];

  if (dailyHourIndex >= 0) {
    newQuantity = this.myHours.hours[dailyHourIndex].quantity + 1;
    updatedHourtems[dailyHourIndex].quantity = newQuantity;
  } else {
    updatedHourItems.push({
      hourId: hour,
      quantity: newQuantity
    });
  }
  const updatedHour = {
    hours: updatedHourItems
  };
  this.myHours = updatedHour;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
