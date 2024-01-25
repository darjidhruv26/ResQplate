const Food = require("../model/food");

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

  res.render("needy/home", {
    pageTitle: "Home",
    city,
    foodData,
  });
};
