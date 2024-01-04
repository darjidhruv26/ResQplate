const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const User = require("./model/user");

const MONGODB_URL =
  "mongodb+srv://mastermind:ES7D5YZV2NH0WBnH@cluster0.rhymsld.mongodb.net/resQplateDB";

mongoose.set("strictQuery", false);
const app = express();
app.set("view engine", "ejs");

const authRoutes = require("./routes/auth");

const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: "sessions",
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "My Secret",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      expires: 600000,
    },
  })
);

app.use(authRoutes);
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
