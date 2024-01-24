const express = require("express");
const donaterController = require("../controller/donater");
const router = express.Router();

router.get("/donator", donaterController.getHomepage);
router.post("/donator", donaterController.postHomepage);
router.get("/donator-type", donaterController.getSubType);

module.exports = router;
