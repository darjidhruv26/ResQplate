const express = require("express");
const recyclerController = require("../controller/recycler");
const router = express.Router();
const isAuth = require("../middleware/is-auth");

router.get("/recycler", recyclerController.getHomepage);

router.get("/allow-location", isAuth, recyclerController.getAllowLocation);
router.post("/allow-location", isAuth, recyclerController.postAllowLocation);

router.get("/needy", isAuth, recyclerController.getHomepage);
router.get("/requestFood", isAuth, recyclerController.getRequestFood);

router.post("/requestFood", isAuth, recyclerController.postRequestFood);
router.post("/requestAccept", isAuth, recyclerController.postRequestAccept);

router.get("/foodReceived", isAuth, recyclerController.getFoodReceived);
router.post("/foodReceived", isAuth, recyclerController.postFoodReceived);

module.exports = router;
