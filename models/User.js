const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true, // Говорит об обязательности поля
    unique: true, // уникальность в Монго ДБ
    validate: {
      validator: validator.isEmail,
      message: 'Неверный адрес электронной почты'
    }
  },
  password: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
