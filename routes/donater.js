const express = require("express");
const donaterController = require("../controller/donater");
const router = express.Router();
const multer = require("multer");
const isAuth = require("../middleware/is-auth");

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

router.get("/donator-type", isAuth, donaterController.getSubType);
router.post("/donator-type", isAuth, donaterController.postDonatorType);

router.get("/donator", isAuth, donaterController.getHomepage);
router.post("/donator", isAuth, donaterController.postHomePage);

router.get("/dashboard", isAuth, donaterController.getDashboard);
router.post("/dashboard", isAuth, donaterController.postDashboard);

router.get("/food-form", isAuth, donaterController.getFoodForm);

router.post(
  "/food-form",
  upload.single("image"),
  isAuth,
  donaterController.postFoodForm
);

router.get('/agreement', isAuth, donaterController.getAgreement)

router.post('/agreement', isAuth, donaterController.postAgreement)

router.get("/donations", isAuth, donaterController.getDonation);

router.post("/deleteFood", isAuth, donaterController.postDeleteFood);

router.get("/foodRequest", isAuth, donaterController.getFoodRequest);

router.post("/foodRequest", isAuth, donaterController.postFoodRequest);

router.get("/acceptedRequest", isAuth, donaterController.getAcceptedRequest);

module.exports = router;
