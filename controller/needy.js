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
  let requestedFoodUser;

  foodData.forEach(food => {
    food.foodRequest.forEach(user => {
      requestedFoodUser = user.requestedUserId.toString() === userId.toString();
      console.log(requestedFoodUser);
    });
  });

  res.render("needy/home", {
    pageTitle: "Home",
    city,
    foodData,
    userId,
    requestedFoodUser,
  });
};

exports.postGetHomepage = async (req, res, next) => {
  const { yes, no, foodId } = req.body;
  const loggedInUserId = req.session.user._id;

  try {
    if (yes) {
      const food = await Food.findByIdAndDelete(foodId);
      if (!food) {
        return res.redirect("/needy");
      }

      return res.redirect("/needy");
    }

    if (no) {
      return res.redirect("/needy");
    }
  } catch (error) {
    return next(error);
  }
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

    const foodData = await Food.findById(requestedFoodId);

    const userExistsInRequest = foodData.foodRequest.some(
      request => request.requestedUserId.toString() === userId.toString()
    );

    if (userExistsInRequest) {
      return res.render("needy/requestFood", {
        pageTitle: "Requested Food",
        foodData,
        userId,
      });
    }

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

exports.getFoodReceived = (req, res, next) => {
  res.render("needy/map", {
    pageTitle: "Received Food",
    foodData: [],
  });
};

exports.postFoodReceived = async (req, res, next) => {
  try {
    const { foodId } = req.body;
    const foodData = await Food.findById(foodId);

    const { businessName } = await User.findById(foodData.foodPublisher);

    res.render("needy/map", {
      pageTitle: "Received Food",
      foodData,
      businessName,
    });
  } catch (err) {
    throw new Error(err.message);
  }
};
