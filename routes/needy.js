const express = require("express");
const needyController = require("../controller/needy");
const router = express.Router();
const isAuth = require("../middleware/is-auth");

router.get("/allow-location", isAuth, needyController.getAllowLocation);
router.post("/allow-location", isAuth, needyController.postAllowLocation);
router.get("/needy", isAuth, needyController.getHomepage);
router.get("/requestFood", isAuth, needyController.getRequestFood);
router.post("/requestFood", isAuth, needyController.postRequestFood);
// router.get("/requestAccept", isAuth, needyController.getRequestAccept);
router.post("/requestAccept", isAuth, needyController.postRequestAccept);

module.exports = router;
