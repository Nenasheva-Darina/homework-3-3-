const chalk = require("chalk");
const Application = require("./models/Application");

async function addApplication(fullName, age, phoneNumber, problem ) {
  await Application.create({ fullName, age, phoneNumber, problem });

  console.log(chalk.bgGreen("Заявка отправлена!"));
}

module.exports = {
  addApplication,
};
