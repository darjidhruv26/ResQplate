const express = require("express");
const donaterController = require("../controller/donater");
const router = express.Router();

router.get("/donater", donaterController.getHomepage);

module.exports = router;
