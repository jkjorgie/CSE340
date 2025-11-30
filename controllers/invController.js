const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    classificationSelect,
  });
};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryByInvId(inv_id);
  const detail = await utilities.buildDetailView(data);
  let nav = await utilities.getNav();
  const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detail,
  });
};

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Process add classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;

  const addResult = await invModel.addClassification(classification_name);

  if (addResult) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    );
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classificationSelect,
    });
  } else {
    let nav = await utilities.getNav();
    req.flash("notice", "Sorry, adding the classification failed.");
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      classification_name,
      errors: null,
    });
  }
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
  });
};

/* ***************************
 *  Process add inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
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

  const addResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (addResult) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    req.flash(
      "notice",
      `The ${inv_year} ${inv_make} ${inv_model} was successfully added.`
    );
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classificationSelect,
    });
  } else {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(
      classification_id
    );
    req.flash("notice", "Sorry, adding the vehicle failed.");
    res.status(501).render("inventory/add-inventory", {
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
      errors: null,
    });
  }
};

/* ***************************
 *  Intentional Error Route
 * ************************** */
invCont.causeError = async function (req, res, next) {
  const error = new Error("Intentional 500 error for testing.");
  error.status = 500;
  throw error;
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInvId(inv_id);
  const classificationList = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
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
    });
  }
};

/* ***************************
 *  Build delete confirmatino view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInvIdAll(inv_id);
  const classificationList = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.deleteInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The vehicle was successfully deleted.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the delete failed.");
    res.status(501).render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
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
    });
  }
};

/* ***************************
 *  Build approve changes view (Admin only)
 * ************************** */
invCont.buildApproveChanges = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const pendingClassifications = await invModel.getPendingClassifications();
    const pendingInventory = await invModel.getPendingInventory();
    res.render("./inventory/approve-changes", {
      title: "Approve Pending Changes",
      nav,
      pendingClassifications,
      pendingInventory,
      errors: null,
    });
  } catch (error) {
    console.error("buildApproveChanges error: " + error);
    req.flash(
      "notice",
      "Sorry, there was an error loading the pending changes."
    );
    res.redirect("/inv/");
  }
};

/* ***************************
 *  Approve Classification
 * ************************** */
invCont.approveClassification = async function (req, res, next) {
  try {
    const { classification_id } = req.body;

    if (!classification_id) {
      req.flash("notice", "Missing classification ID.");
      return res.redirect("/inv/approve");
    }

    const approveResult = await invModel.approveClassification(
      classification_id
    );

    if (approveResult) {
      req.flash("notice", `The classification was successfully approved.`);
    } else {
      req.flash("notice", "Sorry, the classification was not found.");
    }
  } catch (error) {
    console.error("approveClassification error: " + error);
    req.flash(
      "notice",
      "Sorry, there was an error approving the classification."
    );
  }
  res.redirect("/inv/approve");
};

/* ***************************
 *  Approve Inventory
 * ************************** */
invCont.approveInventory = async function (req, res, next) {
  try {
    const { inv_id } = req.body;

    if (!inv_id) {
      req.flash("notice", "Missing vehicle ID.");
      return res.redirect("/inv/approve");
    }

    const approveResult = await invModel.approveInventory(inv_id);

    if (approveResult) {
      req.flash("notice", `The vehicle was successfully approved.`);
    } else {
      req.flash("notice", "Sorry, the vehicle was not found.");
    }
  } catch (error) {
    console.error("approveInventory error: " + error);
    req.flash("notice", "Sorry, there was an error approving the vehicle.");
  }
  res.redirect("/inv/approve");
};

/* ***************************
 *  Delete Classification
 * ************************** */
invCont.deleteClassification = async function (req, res, next) {
  try {
    const { classification_id } = req.body;

    if (!classification_id) {
      req.flash("notice", "Missing classification ID.");
      return res.redirect("/inv/approve");
    }

    const deleteResult = await invModel.deleteClassification(classification_id);

    if (deleteResult && deleteResult.rowCount > 0) {
      req.flash("notice", `The classification was successfully deleted.`);
    } else {
      req.flash("notice", "Sorry, the classification was not found.");
    }
  } catch (error) {
    console.error("deleteClassification error: " + error);
    if (error.code === "23503") {
      req.flash(
        "notice",
        "Cannot delete classification. There are vehicles associated with it."
      );
    } else {
      req.flash(
        "notice",
        "Sorry, there was an error deleting the classification."
      );
    }
  }
  res.redirect("/inv/approve");
};

/* ***************************
 *  Delete Pending Inventory
 * ************************** */
invCont.deletePendingInventory = async function (req, res, next) {
  try {
    const { inv_id } = req.body;

    if (!inv_id) {
      req.flash("notice", "Missing vehicle ID.");
      return res.redirect("/inv/approve");
    }

    const deleteResult = await invModel.deleteInventory(inv_id);

    if (deleteResult && deleteResult.rowCount > 0) {
      req.flash("notice", `The vehicle was successfully deleted.`);
    } else {
      req.flash("notice", "Sorry, the vehicle was not found.");
    }
  } catch (error) {
    console.error("deletePendingInventory error: " + error);
    req.flash("notice", "Sorry, there was an error deleting the vehicle.");
  }
  res.redirect("/inv/approve");
};

module.exports = invCont;
