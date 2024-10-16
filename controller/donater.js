const User = require("../model/user");
const Food = require("../model/food");

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const twilio = require("twilio")(accountSid, authToken);

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

exports.postHomePage = async (req, res, next) => {
  try {
    const name = req.body.businessname;
    const currUserID = req.session.user._id;

    let updatedUser;
    const user = await User.findOne({ _id: currUserID });
    updatedUser = user;
    updatedUser.businessName = name;

    const result = await updatedUser.save();

    if (result) {
      console.log("UPDATED");
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.log(err.message);
  }
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

exports.getAgreement = (req, res, next) => {
  res.render("donator/aggreeement", {
    pageTitle: "Agreement",
  });
};

exports.postAgreement = (req, res, next) => {
  const isAgree = req.body.agreement;

  if (isAgree === "on") {
    res.redirect("/dashboard");
  } else {
    console.log("AGREE THE CONDITIONS");
    res.redirect("/agreement");
  }
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
          return res.redirect("/agreement");
        }
      }
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }
};

exports.getDonation = async (req, res, next) => {
  try {
    const donater = req.session.user;
    const myFood = await Food.find({ _id: { $in: donater.myFood } });

    res.render("donator/donations", {
      donations: myFood,
      pageTitle: "Donations & Request",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.postDeleteFood = async (req, res, next) => {
  try {
    const foodId = req.body.foodId;

    const deleted = await Food.findByIdAndDelete(foodId);

    if (deleted) {
      console.log("Food Deleted");
      res.redirect("/donations");
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getFoodRequest = async (req, res, next) => {
  try {
    const foodData = await Food.find({
      foodRequest: { $exists: true, $ne: [] },
    })
      .populate({
        path: "foodRequest.requestedUserId",
        model: User,
      })
      .exec();

    const userDetails = foodData
      .map(food => {
        return food.foodRequest.map(
          request => request.requestedUserId.username
        );
      })
      .flat();

    res.render("donator/food_requests", {
      pageTitle: "Food Request",
      foodData,
      userDetails,
    });
  } catch (err) {
    throw new Error(err.messsage);
  }
};

exports.postFoodRequest = async (req, res, next) => {
  try {
    const foodId = req.body.foodId;

    const updatedFood = await Food.findByIdAndUpdate(
      foodId,
      { $set: { "foodRequest.$[elem].isAccepted": true } },
      { arrayFilters: [{ "elem.isAccepted": false }], new: true }
    );

    if (updatedFood) {
      const userId = updatedFood.foodRequest[0].requestedUserId;
      const message = "Your food request has been accepted. Enjoy!";

      const user = await User.findById(userId);

      if (user) {
        try {
          const userMobileNumber = `+91${user.mobileno}`;

          const sentMessage = await twilio.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: userMobileNumber,
          });

          console.log("SMS sent:", sentMessage.sid);
        } catch (error) {
          console.error("Error sending SMS:", error);
          res.status(500);
          return res.redirect("/acceptedRequest");
        }
      } else {
        throw new Error("User not found.");
      }
    } else {
      throw new Error("Failed to update food request.");
    }
  } catch (err) {
    next(err);
    return;
  }
  return res.redirect("/acceptedRequest");
};

exports.getAcceptedRequest = async (req, res, next) => {
  try {
    const foodData = await Food.find({
      "foodRequest.isAccepted": true,
    })
      .populate({
        path: "foodRequest.requestedUserId",
        model: User,
      })
      .exec();

    const userDetails = foodData
      .map(food => {
        return food.foodRequest.map(
          request => request.requestedUserId.username
        );
      })
      .flat();

    if (foodData) {
      return res.render("donator/request_accepted", {
        pageTitle: "Accepted Requests",
        foodData,
        userDetails,
      });
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

// W4ACCH3JWZLB18FGF5JLRKQC
