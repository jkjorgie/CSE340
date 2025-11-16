// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Route for login
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route for register
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Route for register post
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
