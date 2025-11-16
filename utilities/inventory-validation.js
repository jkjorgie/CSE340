const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Add Classification Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
  return [
    // classification_name is required and must not contain spaces or special characters
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isLength({ min: 1 })
      .withMessage("Classification name must be at least 1 character.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage(
        "Classification name cannot contain spaces or special characters."
      ),
  ];
};

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Add Inventory Validation Rules
 * ********************************* */
validate.addInventoryRules = () => {
  return [
    // Make is required
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Please provide a make.")
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters."),

    // Model is required
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Please provide a model.")
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters."),

    // Year is required and must be 4 digits
    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Please provide a year.")
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be exactly 4 digits.")
      .matches(/^\d{4}$/)
      .withMessage("Year must be a valid 4-digit number."),

    // Description is required
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Please provide a description."),

    // Image path is required
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Please provide an image path."),

    // Thumbnail path is required
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Please provide a thumbnail path."),

    // Price is required and must be numeric
    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Please provide a price.")
      .isNumeric()
      .withMessage("Price must be a number.")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    // Miles is required and must be numeric
    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("Please provide mileage.")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive integer."),

    // Color is required
    body("inv_color").trim().notEmpty().withMessage("Please provide a color."),

    // Classification is required
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Please select a classification.")
      .isInt()
      .withMessage("Invalid classification selected."),
  ];
};

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(
      classification_id
    );
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

module.exports = validate;
