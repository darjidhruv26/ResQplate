const express = require("express");
const authController = require("../controller/auth");
const router = express.Router();

router.get("/", authController.getSignUpEmail);
router.post("/login", authController.postLogin);

router.get("/signup_password", authController.getSignUpPassword);
router.post("/signup_password", authController.postSignUpPassword);

router.post("/signup_onboarding", authController.postSignUpOnboarding);
router.get("/userOnboarding", authController.getUserOnboarding);
router.post("/email-confirm", authController.postEmailConfirm);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

router.post("/logout", authController.logout);
module.exports = router;
