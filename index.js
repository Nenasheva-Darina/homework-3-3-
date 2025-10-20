const express = require("express");
const chalk = require("chalk");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const Application = require("./models/Application");
const {
  addApplication,
} = require("./application.controller");

const { addUser, loginUser } = require("./user.controller");

const auth = require('./middlewares/auth');
const verifyToken = require('./middlewares/verifyToken');

const port = 3000;
const app = express();

app.set("view engine", "ejs");
app.set("views", "pages");

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.get("/", async (req, res) => {
  res.render("index", {
    title: "Медикал Клиник",
    created: false,
    error: false,
  });
});

app.get("/application", (req, res) => {
  res.render("application", {
    title: "Форма заявки - Медикал Клиник",
    created: true,
    error: false,
    submitted: false,

  });
});

app.get("/staff", async (req, res) => { //Отображение страницы стаф
  const user = verifyToken(req.cookies.token)
  if (user) {
    res.redirect('/requests');
  } else {
    res.render("staff", {
      title: "Раздел для сотрудников - Медикал Клиник",
      error: undefined,
    });
  }
});

app.get("/requests", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; 
    const skip = (page - 1) * limit; 
    
    const applicationsData = await Application.find().skip(skip).limit(limit);

    const applications = applicationsData.map((app) => ({
      _id: app._id,
      fullName: app.fullName, 
      age: app.age,
      phoneNumber: app.phoneNumber,
      problem: app.problem,
      status: app.status,
      date: new Date(app.date).toLocaleDateString('ru-RU') + ' ' + 
            new Date(app.date).toLocaleTimeString('ru-RU', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
    }));
      
    const totalApplications = await Application.countDocuments();
    const totalPages = Math.ceil(totalApplications / limit);

    res.render("requests", {
      title: "Заявки - Медикал Клиник",
      applications: applications, 
      currentPage: page,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      totalApplications: totalApplications,
      user: req.user
    });
  } catch (error) {
    console.error("Error:", error);
    res.render("requests", {
      title: "Заявки - Медикал Клиник",
      applications: [],
      error: "Ошибка загрузки заявок",
      user: req.user,
    });
  }
});

app.get("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true });

  res.redirect("/staff");
});



app.post("/register", async (req, res) => {
  try {
    console.log(req.user.email)
    await addUser(req.body.email, req.body.password, req.user.email);

    res.redirect("/staff"); //Перекидываем пользователя на страницу с входом
  } catch (e) {
    if (e.code === 11000) {
      res.render("staff", {
        title: "Раздел для сотрудников - Медикал Клиник",
        error: undefined,
      });
      return;
    }
    res.render("staff", {
      title: "Раздел для сотрудников - Медикал Клиник",
      error: undefined,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const token = await loginUser(req.body.email, req.body.password);

    res.cookie('token', token)
  

    res.redirect("/requests"); //Перекидываем пользователя на доступную стр для него
  } catch (e) {
      res.render("staff", {
        title: "Раздел для сотрудников - Медикал Клиник",
        error: e.message,
      });
      return;
    }
});

app.post("/application", async (req, res) => {
  try {
    console.log(req.body)
    await addApplication(req.body.fullName, req.body.age, req.body.phoneNumber, req.body.problem);
    res.render("application", {
      title: "Форма заявки - Медикал Клиник",
      submitted: true,
      created: true,
      error: false,
    });
  } catch (e) {
    console.log("Ошибка", e);
    res.render("application", {
      title: "Форма заявки - Медикал Клиник",
      created: false,
      submitted: false,
      error: true,
    });
  }
});



mongoose
  .connect("mongodb://user:mongopass@localhost:27017/testdb?authSource=admin")
  .then(() => {
    app.listen(port, () => {
      console.log(chalk.green(`Server has been started on port ${port}...`));
    });
  });
