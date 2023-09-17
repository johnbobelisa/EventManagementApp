const Stats = require("../controller/stats");
const express = require("express");
const Event = require("../models/event-schema");
const EventCategory = require("../models/category");

const router = express.Router();

//Middleware to access req.body and read JSON
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

/**
 * Render the 'add-event' html page.
 * @name /event/add
 */
router.get('/event/add', function(req, res){
    res.render("add-event");
  }); 
/**
 * Endpoint to POST event data.
 * Updates Stats.insertEvent
 * @name /add-event-post
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.post('/add-event-post', async (req, res) => {
  try {
    const newEvent = new Event({
      name: req.body.name,
      description: req.body.description,
      startDateTime: req.body.datetime,
      durationInMinutes: req.body.duration,
      isActive: req.body.isActive,
      image: req.body.image,
      capacity: req.body.capacity,
      ticketsAvailable: req.body.tickets,
      categoryId: req.body.categoryid
    });

    // pushing event to respect category database
    let catId = req.body.categoryid;
    let theCategory = await EventCategory.findOne({id: catId})
    theCategory.eventList.push(newEvent._id);
    await theCategory.save();

    await newEvent.save();
    await Stats.insertEvent();
    res.redirect('/John/events');

  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});
/**
 * Retrieve all events and render "event-list" html page.
 * @name /events
 */
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.render("event-list", { events: events });
  } catch (err) {
    res.status(500).send('Internal Server err')
  }    
});   
/**
 * Retrieve all sold-out events and render "event-sold-out" html page.  
 * @name /sold-out-events
 */
router.get('/sold-out-events', async (req, res) => {
  try {
      const soldOutEvents = await Event.find({ ticketsAvailable: 0 });
      res.render("event-sold-out", { SoldOutEvents: soldOutEvents });
  } catch (err) {
      res.status(500).json({ err: "Internal Server err" });
  }
});
/**
 * Render the 'category-detail-input' page.
 * @name /category
 */
router.get('/category', function(req, res){
  res.render("category-detail-input");
}); 
/**
 * Retrieve category details based on the inputted categoryID.
 * Also renders "category-detail" html page
 * @name category/:id
 */
router.get('/category/:id', async (req, res) => {
  try {
      const category_id = req.params.id;
      const category = await EventCategory.find({ id: category_id });
      
      if (category) {
          const categorydetail = await Event.find({ categoryId: category_id });

          res.render("category-detail", { category: category, categorydetail: categorydetail });
      } else {
          res.redirect('/John/category/');
      }
  } catch (err) {
      res.status(500).json({ err: "Internal Server err" });
  }
});
/**
 * Render the 'delete-event' page.
 * @name event/delete
 */
router.get('/event/delete', function(req, res) {
    res.render("delete-event");
});
/**
 * Remove event based on the inputted event ID.
 * Also updates Stats.deleteEvent
 * @name /event/remove
 */
router.get('/event/remove', async (req, res) => {
  let input_id = req.query.id;
  try {
    const result = await Event.deleteOne({ id: input_id });
    if (result.deletedCount === 1) {
      await EventCategory.updateMany(
        { eventsList: result._id },
        { $pull: { eventsList: result._id } }
      );
      await Stats.deleteEvent();
      res.redirect("/John/events"); 
    } else {
      res.status(404).json({ err: "Event Not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal Server err" });
  }
});

/**
 * Render the '404-not-found' page for endpoints that don't exist.
 * @name /*
 */
router.get("*", function(req, res) {
    res.render("404-not-found");
});

module.exports = router;