const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification WHERE active = 'Y' ORDER BY classification_name"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1 AND c.active = 'Y' AND i.active = 'Y'`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
    throw new Error("No matching classification found");
  }
}

/* ***************************
 *  Get inventory item by inv_id
 * ************************** */
async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1 AND active = 'Y'`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getInventoryByInvId error " + error);
    throw new Error("No matching vehicle found");
  }
}

/* ***************************
 *  Get inventory item by inv_id (including inactive)
 * ************************** */
async function getInventoryByInvIdAll(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getInventoryByInvIdAll error " + error);
    throw new Error("No matching vehicle found");
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO public.classification (classification_name, active) VALUES ($1, 'N') RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    console.error("addClassification error: " + error);
    throw error;
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory(
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
) {
  try {
    const sql =
      "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'N') RETURNING *";
    return await pool.query(sql, [
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
    ]);
  } catch (error) {
    console.error("addInventory error: " + error);
    throw error;
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
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
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    console.error("model error: " + error);
  }
}

/* ***************************
 *  Get pending classifications (active = 'N')
 * ************************** */
async function getPendingClassifications() {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification WHERE active = 'N' ORDER BY classification_name"
    );
    return data.rows;
  } catch (error) {
    console.error("getPendingClassifications error: " + error);
    throw error;
  }
}

/* ***************************
 *  Get pending inventory (active = 'N')
 * ************************** */
async function getPendingInventory() {
  try {
    const data = await pool.query(
      `SELECT i.*, c.classification_name 
       FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.active = 'N' 
       ORDER BY i.inv_make, i.inv_model`
    );
    return data.rows;
  } catch (error) {
    console.error("getPendingInventory error: " + error);
    throw error;
  }
}

/* ***************************
 *  Approve classification (set active = 'Y')
 * ************************** */
async function approveClassification(classification_id) {
  try {
    const sql =
      "UPDATE public.classification SET active = 'Y' WHERE classification_id = $1 RETURNING *";
    const data = await pool.query(sql, [classification_id]);
    return data.rows[0];
  } catch (error) {
    console.error("approveClassification error: " + error);
    throw error;
  }
}

/* ***************************
 *  Approve inventory (set active = 'Y')
 * ************************** */
async function approveInventory(inv_id) {
  try {
    const sql =
      "UPDATE public.inventory SET active = 'Y' WHERE inv_id = $1 RETURNING *";
    const data = await pool.query(sql, [inv_id]);
    return data.rows[0];
  } catch (error) {
    console.error("approveInventory error: " + error);
    throw error;
  }
}

/* ***************************
 *  Delete classification
 * ************************** */
async function deleteClassification(classification_id) {
  try {
    const sql =
      "DELETE FROM public.classification WHERE classification_id = $1";
    const data = await pool.query(sql, [classification_id]);
    return data;
  } catch (error) {
    console.error("deleteClassification error: " + error);
    throw error;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInvId,
  getInventoryByInvIdAll,
  addClassification,
  addInventory,
  updateInventory,
  deleteInventory,
  getPendingClassifications,
  getPendingInventory,
  approveClassification,
  approveInventory,
  deleteClassification,
};
