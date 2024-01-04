// tfik kuoh udkf gfxw
const crypto = require("crypto");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dmeet2625@gmail.com",
    pass: "tfik kuoh udkf gfxw",
  },
});

let userEmail;

exports.getHome = (req, res, next) => {
  res.render("home", {
    pageTitle: "resQplate",
  });
};

exports.getSignUpEmail = (req, res, next) => {
  res.render("signup_email", {
    pageTitle: "Signup | Login",
  });
};

exports.getSignUpPassword = (req, res, next) => {
  res.render("signup_password", {
    emailExists: true,
    email: userEmail,
    pageTitle: "Signup",
  });
};

exports.postSignUpPassword = (req, res, next) => {
  const { email } = req.body;
  userEmail = email;
  let emailExists = false;
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        emailExists = true;
      }
      return res.render("signup_password", {
        emailExists,
        email,
        pageTitle: "Signup",
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
};

exports.postSignUpOnboarding = async (req, res, next) => {
  try {
    const { email, password, name, mobileno } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      username: name,
      mobileno,
    });

    const result = await user.save();

    if (result) {
      const mailOptions = {
        to: email,
        from: "dmeet2625@gmail.com",
        subject: "Thanks you for signing up!",
        html: `
        <p>Thank you for signing up.</p>
        <p>Click this <a href="http://localhost:3000/">link</a> to signup.</p>
        `,
      };

      const mail = await transporter.sendMail(mailOptions);
      console.log(mail);

      req.session.isLoggedIn = true;
      req.session.user = result;

      await req.session.save();

      return res.render("email_confirm", {
        email: result.email,
        pageTitle: "Email Confirm",
      });
    }
  } catch (err) {
    console.error("Error:", err);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user === null) {
      console.log("Signup first");
      return res.redirect("/signup_email");
    }

    const doMatch = bcrypt.compare(password, user.password);

    if (doMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user;

      console.log(req.session);

      await new Promise((resolve, reject) => {
        req.session.save(err => {
          if (err) {
            console.log("Session save error", err);
            reject(err);
          } else {
            console.log("Session saved successfully");
            resolve();
          }
        });
      });

      return res.redirect("/home");
    } else {
      console.log("Password is not matched");
      return res.redirect("/signup_password");
    }
  } catch (err) {
    console.error("Error:", err);
  }
};

exports.getReset = (req, res, next) => {
  res.render("reset", {
    pageTitle: "Reset Password",
    email: userEmail,
  });
};

exports.postReset = (req, res, next) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) return res.redirect("/");
    const token = buffer.toString("hex");
    User.findOne({ email: userEmail })
      .then(user => {
        if (!user) {
          console.log("Your email address is not registered.");
          return res.redirect("/signup_email");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        transporter.sendMail({
          to: email,
          from: "dmeet2625@gmail.com",
          subject: "Password reset",
          html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
        `,
        });
        if (result) {
          console.log("Email has sent successfully");
          return res.render("email_confirm", {
            email,
            pageTitle: "Email Confirm",
          });
        }
      })
      .then(res => {
        return;
      })
      .catch(err => {
        console.log(err.message);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then(user => {
      res.render("new-password", {
        userId: user._id.toString(),
        passwordToken: token,
        pageTitle: "Reset Password",
        email: user.email,
      });
    })
    .catch(err => {
      console.log(err.message);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })

    .then(result => {
      console.log("Password has been changed!");
      return res.render("password_reset", {
        email: resetUser.email,
        pageTitle: "Password Change",
      });
    })
    .catch(err => {
      console.log(err.message);
    });
};
