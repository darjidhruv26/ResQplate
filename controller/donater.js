const User = require("../model/user");
const Food = require("../model/food");

exports.getSubType = (req, res, next) => {
  res.render("donator/donator_type", {
    pageTitle: "Donater type",
  });
};

exports.postDonatorType = async (req, res, next) => {
  try {
    const { donatorType } = req.body;
    const existingDonatorId = req.session.user._id;
    let existingDonator;

    existingDonator = await User.findOne({ _id: existingDonatorId });

    if (!existingDonator) {
      console.log("User not found");
    }

    existingDonator.donatorType = donatorType;
    await existingDonator.save();

    res.redirect("/donator");
  } catch (err) {
    console.log(err.message);
  }
};

exports.getHomepage = (req, res, next) => {
  res.render("donator/home", {
    pageTitle: "Donater",
  });
};

exports.postHomePage = (req, res, next) => {
  // const name = req.body.businessname;
  res.redirect("/dashboard");
};

exports.getDashboard = (req, res, next) => {
  res.render("donator/donator_dashboard", {
    pageTitle: "Dashboard",
  });
};

exports.postDashboard = (req, res, next) => {
  res.redirect("/food-form");
};

exports.getFoodForm = (req, res, next) => {
  res.render("donator/food_form", {
    pageTitle: "Form",
    error: null,
  });
};

exports.postFoodForm = async (req, res, next) => {
  try {
    const currUser = req.session.user;

    if (!currUser) {
      console.log("User not found!");
      return res.redirect("/login");
    }

    const {
      foodname,
      foodcategory,
      foodType,
      foodAmountDigit,
      foodAmountNo,
      foodMeasure,
      foodExpireTime,
    } = req.body;

    if (!req.file) {
      console.log("No file uploaded!");
    } else {
      const imageUrl = req.file ? req.file.path : "";

      const food = new Food({
        image: imageUrl,
        name: foodname,
        foodPublisher: currUser,
        category: foodcategory,
        type: foodType,
        amount: foodAmountNo || "",
        feedAbout: foodAmountDigit || "",
        matter: foodMeasure || "",
        expiresTime: foodExpireTime,
      });

      const result = await food.save();

      if (result) {
        const foodID = result._id;
        const updatedUser = await User.findByIdAndUpdate(
          currUser._id,
          { $addToSet: { myFood: foodID } },
          { new: true }
        );

        if (updatedUser) {
          console.log("Food Added!");
          return res.redirect("/dashboard");
        }
      }
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }
};
