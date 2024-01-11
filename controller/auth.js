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

const handleSessionSave = req =>
  new Promise((resolve, reject) => {
    req.session.save(err => (err ? reject(err) : resolve()));
  });

let userEmail;

exports.getSignUpEmail = (req, res, next) => {
  res.render("auth/signup_email", {
    pageTitle: "Signup | Login",
  });
};

exports.getSignUpPassword = (req, res, next) => {
  res.render("auth/signup_password", {
    emailExists: true,
    email: userEmail,
    pageTitle: "Onboarding",
  });
};

exports.postSignUpPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    userEmail = email;

    const user = await User.findOne({ email });

    return res.render("auth/signup_password", {
      emailExists: !!user,
      email,
      pageTitle: "Signup",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
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
      req.session.isLoggedIn = true;
      req.session.user = result;
      await handleSessionSave(req);
    }

    return res.redirect("/userOnboarding");
  } catch (err) {
    console.error("Error:", err);
  }
};

exports.getUserOnboarding = (req, res, next) => {
  res.render("auth/onboarding2", {
    pageTitle: "Onboarding",
  });
};

exports.postEmailConfirm = async (req, res, next) => {
  try {
    const { userType } = req.body;
    const email = req.session.user.email;

    let updateUser = await User.findOne({ email });

    if (updateUser) {
      updateUser.userType = userType;
      await updateUser.save();

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

      return res.render("auth/email_confirm", {
        email: updateUser.email,
        pageTitle: "Email Confirm",
      });
    } else {
      return res.status(404).send("User not found");
    }
  } catch (error) {
    console.log(error.message);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("Signup first");
      return res.redirect("/signup_email");
    }

    const doMatch = bcrypt.compare(password, user.password);

    if (doMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user;

      // console.log(req.session);

      await handleSessionSave(req);

      const userTypePages = {
        donater: "/donater",
        recycler: "/recycler",
        needy: "/allow-location",
      };

      const redirectPage = userTypePages[user.userType];

      return res.redirect(redirectPage);
    } else {
      console.log("Password is not matched");
      return res.redirect("/signup_password");
    }
  } catch (err) {
    console.error("Error:", err);
  }
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
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
          return res.render("auth/email_confirm", {
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
      res.render("auth/new-password", {
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
      return res.render("auth/password_reset", {
        email: resetUser.email,
        pageTitle: "Password Change",
      });
    })
    .catch(err => {
      console.log(err.message);
    });
};
