/**
 * This file is used for usual routing for web page
 * @author Yi Mei Lee
 */

/**
 * express constant
 * @const
 */
const express = require("express");

/**
 * category model constant
 * @const
 */
const Category = require("../models/category");

/**
 * Stats controller constant
 * @const
 */
const Stats = require("../controller/stats");

/**
 * event model constant
 * @const
 */
const Event = require("../models/event-schema");

/**
 * router constant
 * @const
 */
const router = express.Router();

router.use(express.urlencoded({ extended: true}));
router.use(express.json());

/**
 * Route going add-category page (add category):
 * @name get/add-category
 * @function
 * @param {string} path - express path
 * @param {function} - express callback
 */
router.get("/add-category", function(req, res) {
    res.render("add-category");
    })

/**
 * Send add-category data to backend (add category):
 * create EventCategory object and pushed the object into the category data base then redirect to the list-category page
 * @name post/add-cat
 * @function
 * @param {string} actionName - the action name from the form
 * @param {function} - express callback
 */
router.post("/add-cat", async function(req, res) {
    // create EventCategory object by passing required input
    let newCategory = new Category({name: req.body.catName, description: req.body.catDesc, image: req.body.catRes});
    
    // update to the category database
    await newCategory.save();

    // notify creation of category
    await Stats.insertCategory();

    // redirect to the category list
    res.redirect("/category/33254834/event-categories");
  })
  
// List categories:

/**
 * Route going event-categories page (list event):
 * go to event-categories page while passing the catDb to it
 * @name get/event-categories
 * @function
 * @param {string} path - express path
 * @param {function} - express callback
 */
router.get("/event-categories", async function(req, res) {
    let categories = await Category.find();
    // go to event-categories page while passing the catDb to it
    res.render("event-categories", {cat: categories});
  })

// List categories with keyword:

/**
 * Route going event-categories page with databased filtered (list filtered events):
 * go to event-categories page while passing the filtered data base to it filtered by keyword from query
 * @name get/search-category
 * @function
 * @param {string} path - express path
 * @param {function} - express callback
 */
router.get("/search-category", async function(req, res) {
    // get the keyword by query
    let keyword = req.query.keyword;
  
    // get database
    let categories = await Category.find();
    // get the db that contains category description including the keyword
    let filteredDb = categories.filter((category) => category.description.toLowerCase().includes(keyword));
  
    // go to the category-search html while sending the keyword and the filteredDb to the page
    res.render("category-search", {cat: filteredDb, keyword: keyword});
  })

// set up search_category-detail post method

/**
 * Get the keyword input that require search
 * 
 * Then go to search for the keyword and list them out
 * 
 * @name post/search-category-detail
 * @function
 * @param {string} actionName - the action name from the form
 * @param {function} - express callback
 */
router.post("/search-category-detail", function(req, res) {

    // get searchId from the body
    let keyword = req.body.searchKeyword;

    // redirect to the page with searchId as parameter
    res.redirect("/category/33254834/search-category/?keyword=" + keyword);
    })

// Show Event Details

/**
 * Route going get-event-detail page (Show Event Details):
 * that get input from user to check which event detail to be shown
 * 
 * @name get/search-event
 * @function
 * @param {string} path - express path
 * @param {function} - express callback
 */
router.get("/search-event", function(req, res) {
    // go to get-event-detail html
    res.render("get-event-detail");
    })

/**
 * Route going event-details page (Show event details):
 * go to event-details page that show the detail of the event by matching id 
 * 
 * get the id to search from the parameter and match the id with the event database id then send the event to the event-detail page
 * if nothing found, go to not found page
 * 
 * @name get/event/:eventId
 * @function
 * @param {string} path - express path
 * @param {function} - express callback
 */
router.get("/event/:eventId", async function(req, res) {
    // get the searchId from the parameter
    let searchId = req.params.eventId;
  
    //get event object from database
    let event = await Event.findOne({id: searchId})
    // find event that match event id and search id
  
    if (!event) {
      res.render("404-not-found");
    }
    else{
      // go to event-details html while sending event object to the page
      res.render("event-details", {event: event});
    }
    })

// set up search_event post method
/**
 * Route to filtered category list after getting the keyword input  (show event details):
 * 
 * get search id from the body then redirect to the event-details page by adding search id as parameter
 * 
 * @name post/search_event
 * @function
 * @param {string} actionName - the action name from the form
 * @param {function} - express callback
 */
router.post("/search_event", function(req, res) {

    // get searchId from the body
    let searchId = req.body.eventId;
  
    // redirect to the page with searchId as parameter
    res.redirect("/category/33254834/event/" + searchId);
    })

// Delete category
/**
 * Route going delete-category page (delete category): 
 * 
 * @name get/delete-category
 * @function
 * @param {string} path - express path
 * @param {function} - express callback
 */
router.get("/delete-category", function(req, res) {
    // go to the delete-category html
    res.render("delete-category");
  })
  
// Delete category
/**
 * Route going delete-category page (delete category):
 * 
 * get deleteId from the input body
 * then delete the category from the data base if there are matching id by filtering the database
 * then also remove the events that is stored inside the event list of the category
 * then redirect to the list category page
 * 
 * @name post/delete_cat
 * @function
 * @param {string} path - express path
 * @param {function} - express callback
 */
router.post("/delete_cat", async function(req, res) {
    // get the deleteId from the body
    let deleteId = req.body.catId;

    // getting the deleting category
    let deletingCategory = await Category.findOne({id: deleteId});
        
    if (deletingCategory) {
      // get the array of event that is required for removal
      let deletingEvent = deletingCategory.eventList;

      // delete the category from database
      await Category.deleteOne({id: deleteId});

      // notify stats removal of category
      await Stats.deleteCategory();

      deletingEvent.map(async function (event) {
          // delete the event from event database
          await Event.deleteOne({_id: event});

          // notify stats there are removal event going on
          await Stats.deleteEvent();
          });

      // redirect to the category list page
      res.redirect("/category/33254834/event-categories");
    }
    else {
      res.render("404-not-found")
    }
    })

/**
 * export module
 */
module.exports = router;