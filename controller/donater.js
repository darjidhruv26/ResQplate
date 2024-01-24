const User = require("../model/user");

exports.getSubType = (req, res, next) => {
  res.render("donator/donator_type", {
    pageTitle: "Donater type",
  });
};

exports.getHomepage = (req, res, next) => {
  res.render("donator/home", {
    pageTitle: "Donater",
  });
};

exports.postHomepage = async (req, res, next) => {
  try {
    const { donatorType } = req.body;
    console.log(donatorType);
    const existingDonatorId = req.session.user._id;
    let existingDonator;
    console.log(existingDonatorId);

    existingDonator = await User.findOne({ _id: existingDonatorId });

    if (!existingDonator) {
      console.log("User not found");
    }

    existingDonator.donatorType = donatorType;
    await existingDonator.save();

    console.log("UPDATED");
    res.redirect("/donator");
  } catch (err) {
    console.log(err.message);
  }
};
