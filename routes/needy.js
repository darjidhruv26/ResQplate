const express = require("express");
const needyController = require("../controller/needy");
const router = express.Router();

router.get("/allow-location", needyController.getAllowLocation);
router.post("/allow-location", needyController.postAllowLocation);
router.get("/needy", needyController.getHomepage);

module.exports = router;
