const express = require("express");
const recyclerController = require("../controller/recycler");
const router = express.Router();

router.get("/recycler", recyclerController.getHomepage);

module.exports = router;
