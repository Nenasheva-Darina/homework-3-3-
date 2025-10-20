const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('./public/constants');

async function addUser(email, password, owner) {
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ email, password: passwordHash, owner});
}

async function loginUser(email, password) {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('Пользователь не найден')
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password) //Проверяем пароль на корректность 
   if (!isPasswordCorrect) {
    throw new Error('Неправильный пароль')
  }

  return jwt.sign({email}, JWT_SECRET, {expiresIn: '30d'})
}

module.exports = { addUser, loginUser };
