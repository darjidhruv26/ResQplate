const Food = require("../model/food");
const User = require("../model/user");

exports.getAllowLocation = (req, res, next) => {
  res.render("needy/allow-location", {
    pageTitle: "Allow Location",
  });
};

exports.postAllowLocation = (req, res, next) => {
  const { city } = req.body;
  console.log(city);
  res.redirect(`/needy?city=${city}`);
};

exports.getHomepage = async (req, res, next) => {
  const city = req.query.city;
  const foodData = await Food.find();
  const userId = req.session.user._id;

  res.render("needy/home", {
    pageTitle: "Home",
    city,
    foodData,
    userId,
  });
};

exports.getRequestFood = (req, res, next) => {
  const userId = req.session.user._id;
  res.render("needy/requestFood", {
    pageTitle: "Request Food",
    userId,
  });
};

exports.postRequestFood = async (req, res, next) => {
  try {
    const requestedFoodId = req.body.currFood;
    const userId = req.session.user._id;

    const currentFoodId = req.body.currFood;

    // Find the food document
    const foodData = await Food.findById(requestedFoodId);

    // Check if userId already exists in foodRequest array
    const userExistsInRequest = foodData.foodRequest.some(
      request => request.requestedUserId.toString() === userId.toString()
    );

    // If userId already exists, handle accordingly
    if (userExistsInRequest) {
      return res.render("needy/requestFood", {
        pageTitle: "Requested Food",
        foodData,
        userId,
      });
    }

    // If userId does not exist, push requestObject
    const requestObject = {
      requestedUserId: userId,
      isAccepted: false,
    };

    const updatedFood = await Food.findByIdAndUpdate(
      requestedFoodId,
      {
        $push: {
          foodRequest: requestObject,
        },
      },
      { new: true }
    );

    return res.render("needy/requestFood", {
      pageTitle: "Requested Food",
      foodData,
      userId,
    });
  } catch (err) {
    next(err);
  }
};

// exports.getRequestAccept = (req, res, next) => {
//   res.redirect("/requestAccept");
// };

exports.postRequestAccept = async (req, res, next) => {
  const userId = req.session.user._id;
  const foodId = req.body.foodId;
  let isAccept;
  try {
    const foodData = await Food.findById(foodId);
    console.log(foodData.foodRequest);
    const allIds = foodData.foodRequest.map(food => {
      if (userId.toString() == food.requestedUserId.toString()) {
        isAccept = food.isAccepted;
      }
      return food.requestedUserId;
    });
    res.render("needy/accepted", { isAccept, foodData });
  } catch (err) {
    throw new Error(err.message);
  }
};
