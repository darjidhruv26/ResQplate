exports.getAllowLocation = (req, res, next) => {
  res.render("needy/allow-location", {
    pageTitle: "Allow Location",
  });
};

exports.postAllowLocation = (req, res, next) => {
  const { city } = req.body;
  res.redirect(`/needy?city=${city}`);
};

exports.getHomepage = (req, res, next) => {
  const city = req.query.city;

  res.render("needy/home", {
    pageTitle: "Home",
    city,
  });
};
