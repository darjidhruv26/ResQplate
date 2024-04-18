const express = require("express");
const needyController = require("../controller/needy");
const router = express.Router();
const isAuth = require("../middleware/is-auth");

router.get("/allow-location", isAuth, needyController.getAllowLocation);
router.post("/allow-location", isAuth, needyController.postAllowLocation);

router.get("/needy", isAuth, needyController.getHomepage);
router.post("/needy", isAuth, needyController.postGetHomepage);

router.get("/requestFood", isAuth, needyController.getRequestFood);

router.post("/requestFood", isAuth, needyController.postRequestFood);
router.post("/requestAccept", isAuth, needyController.postRequestAccept);

router.get("/foodReceived", isAuth, needyController.getFoodReceived);
router.post("/foodReceived", isAuth, needyController.postFoodReceived);

module.exports = router;
