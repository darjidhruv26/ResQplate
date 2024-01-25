const express = require("express");
const donaterController = require("../controller/donater");
const router = express.Router();
const multer = require("multer");

// Define the storage and file filter
const storage = multer.diskStorage({
  destination: "images/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    req.fileValidationError =
      "Invalid file type. Only PNG, JPG, and JPEG are allowed.";
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get("/donator-type", donaterController.getSubType);
router.post("/donator-type", donaterController.postDonatorType);

router.get("/donator", donaterController.getHomepage);
router.post("/donator", donaterController.postHomePage);

router.get("/dashboard", donaterController.getDashboard);
router.post("/dashboard", donaterController.postDashboard);

router.get("/food-form", donaterController.getFoodForm);

router.post(
  "/food-form",
  upload.single("image"),
  donaterController.postFoodForm
);

module.exports = router;
