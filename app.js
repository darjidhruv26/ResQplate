const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const multer = require("multer");

const User = require("./model/user");
require('dotenv').config();

const MONGODB_URL =process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
const app = express();
app.set("view engine", "ejs");  

const authRoutes = require("./routes/auth");
const needyRoutes = require("./routes/needy");
const donaterRoutes = require("./routes/donater");
const recyclerRoutes = require("./routes/recycler");

const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: "sessions",
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "My Secret",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      expires: 6000000,
    },
  })
);

app.use(authRoutes);
app.use(needyRoutes);
app.use(donaterRoutes);
app.use(recyclerRoutes);
app.use(express.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    res.redirect("/500");
  } else {
    next();
  }
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      throw new Error(err);
    });
});

mongoose
  .connect(MONGODB_URL)
  .then(db => {
    app.listen(3000);
    console.log("Database is Connected.");
  })
  .catch(err => {
    console.log(err);
    console.log("Database not connected!");
  });
