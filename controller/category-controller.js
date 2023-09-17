/**
 * This file is used to control all the api function for category
 * @author Yi Mei Lee
 */

/**
 * Category model
 * @const
 */
const Category = require("../models/category");

/**
 * Event model
 * @const
 */
const Event = require("../models/event-schema");

/**
 * Stats Controller
 * @const
 */
const Stats = require("./stats");

module.exports = {
    /**
     * Insert Category async function,
     * used to insert a new category into the database
     * and return the newCategory json Object through res,
     * stats also will be updated
     * if there are issue with inserting category, return error json
     * 
     * @name insertCategory
     * @function
     * @param {string} path - express path
     * @param {function} - express callback
     */
    insertCategory: async function (req, res) {
        try {
            let newCategory = new Category({name: req.body.name, description: req.body.desc, image: req.body.img});
            await newCategory.save();
            
            // tell stats new category is inserted
            await Stats.insertCategory();
            res.status(200).json(newCategory);
        }
        catch (error) {
            res.status(400).json({error: "Error while inserting category (maybe wrong naming convension)"})
        }
        
    },
    /**
     * List Category async function,
     * used to list all category in the database
     * and return the categories json Object through res,
     * if there are issue with deleting category, return error json
     * 
     * @name listAll
     * @function
     * @param {string} path - express path
     * @param {function} - express callback
     */
    listAll: async function (req, res) {
        let categories = await Category.find().populate("eventList").exec();
        res.status(200).json(categories);
    },
    /**
     * Delete Category async function,
     * used to delete an existing category from the database
     * and return the deleted json Object through res,
     * also will update with stats
     * if there are issue with deleting category, return error json
     * 
     * @name deleteCategory
     * @function
     * @param {string} path - express path
     * @param {function} - express callback
     */
    deleteCategory: async function (req, res) {
        try {
            // get delete id from request
            let deleteId = req.body.categoryId;

            // find category
            let deletingCategory = await Category.findOne({id: deleteId});

            if (deletingCategory) {
                 // get the array of event that is required for removal
            let deletingEvent = deletingCategory.eventList;

            // delete the category from database
            let deletedCategory = await Category.deleteOne({id: deleteId});

            // notify deletion of category
            await Stats.deleteCategory();

            deletingEvent.map(async function (event) {
                // delete the event from event database
                await Event.deleteOne({_id: event});

                // tell stats there are removal event going on
                await Stats.deleteEvent();
                });

            res.status(202).json(deletedCategory);
            }
            else {
                res.status(400).json({error: "No matching id for deletion"})
            }
        }
        catch (error) {
            res.status(400).json({error: "Internal error occured"})
        }
    },
    /**
     * Update Category async function,
     * used to update an existing category in the database
     * also update for the stats
     * if there are no matching category, return error json
     * 
     * @name updateCategory
     * @function
     * @param {string} path - express path
     * @param {function} - express callback
     */
    updateCategory: async function (req, res) {
        
        let categoryId = req.body.categoryId;
        let newName = req.body.name;
        let newDesc = req.body.desc;
        let categoryUpdating = await Category.findOne({id: categoryId});
        
        // to check if there are any matching category for the update
        if (categoryUpdating) {
            // update the category
            let category = await Category.updateOne({id: categoryId}, {$set: {name: newName, description: newDesc}});

            // tell stats there are updated category
            await Stats.updateRecord();

            // return update json
            res.status(202).json(category);
        }
        else {
            // if no matching category for updating
            res.status(400).json({status: "ID not found"});
        }
    }
}