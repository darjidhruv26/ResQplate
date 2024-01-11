exports.getHomepage = (req, res, next) => {
  res.render("donater/home", {
    pageTitle: "Donater",
  });
};
