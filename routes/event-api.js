const express = require("express");
const eventCont = require("../controller/event-controller")
const router = express.Router();

/**
 * @module Router
 */

/**
 * Endpoint to add a new event.
 * @name post/api/v1/add-event
 */
router.post("/api/v1/add-event", eventCont.addEvent);
/**
 * Endpoint to retrieve all events.
 * @name get/api/v1/events
 */
router.get('/api/v1/events', eventCont.listallEvents);
/**
 * Endpoint to delete an event.
 * @name delete/api/v1/delete-event
 */
router.delete("/api/v1/delete-event", eventCont.deletebyID);
/**
 * Endpoint to update an event.
 * @name put/api/v1/update-event
 */
router.put("/api/v1/update-event", eventCont.updateEvent);

module.exports = router;