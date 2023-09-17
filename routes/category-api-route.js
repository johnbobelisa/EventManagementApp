/**
 * This file is for routing with api
 * @author Yi Mei Lee
 */

/**
 * express constant
 * @const
 */
const express = require("express");

/**
 * Category controller constant
 * @const
 */
const categoryController = require("../controller/category-controller");

/**
 * router constant
 * @const
 */
const router = express.Router();

// router.use(express.urlencoded({ extended: true}));
// router.use(express.json());

/**
 * post for adding category to database
 * @name post/add-categories
 * @function
 */
router.post("/add-categories", categoryController.insertCategory);

/**
 * get to get the categories list from database
 * @name get/list-categories
 * @function
 */
router.get("/list-categories", categoryController.listAll);

/**
 * delete to delete the category from database
 * @name delete/delete-category
 * @function
 */
router.delete("/delete-category", categoryController.deleteCategory);

/**
 * put to update category in database
 * @name put/update-category
 * @function
 */
router.put("/update-category", categoryController.updateCategory);


/**
 * export module
 */
module.exports = router;