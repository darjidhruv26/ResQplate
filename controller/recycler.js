exports.getHomepage = (req, res, next) => {
  res.render("recycler/home", {
    pageTitle: "Recycler",
  });
};
