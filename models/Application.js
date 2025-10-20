const mongoose = require("mongoose");

const ApplicationSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 150,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^\+7\d{10}$/,
  },
  problem: {
    type: String,
    required: false,
    maxLength: 300,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'новая',
    enum: ['новая', 'в работе', 'завершена']
  }
});

const Application  = mongoose.model("Application", ApplicationSchema);

module.exports = Application;
