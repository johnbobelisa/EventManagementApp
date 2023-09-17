const Event = require("../models/event-schema");
const EventCategory = require("../models/category")
const Stats = require("./stats");


/**
 * Event Controller Module
 * @module event-controller
 */
module.exports = {
  /**
   * 
   * Add event async function, used to insert event to the database
   * in a JSON format sent through the body of the HTTP request. 
   * Also adds the new event object ID to the 'eventList' array 
   * field in all the categories under this event. 
   * 
   * @async
   * @function
   * @param {Object} req - Object containing required fields (name, startDateTime, durationInMinutes, isActive, categoryId)
   * and optional fields (description, image, capacity, ticketsAvailable). 
   * @param {Object} res 
   * @returns a JSON object containing the event ID of the new event.
   */
	addEvent: async function (req, res) {
    try {
        // Convert comma seperated categoryids from the body into an array 
        let catIDs = req.body.categories.split(",");

        // Filter the categories to find the ones with matching id's.
        let categoryFilter = await EventCategory.find({
            id: {
                $in: catIDs
            }
        });

        let catObjIds = categoryFilter.map(doc => doc._id);

        // Create the new event
        let newEvent = new Event({
            name: req.body.name,
            description: req.body.description,
            startDateTime: req.body.startDateTime,
            durationInMinutes: req.body.durationInMinutes,
            isActive: req.body.isActive,
            image: req.body.image,
            capacity: req.body.capacity,
            ticketsAvailable: req.body.tickets,
            categoryId: req.body.categories,
            categoryList: catObjIds
        });
        
        let validationError = newEvent.validateSync();
        if (validationError) {
            return res.status(400).json({ error: validationError.message });
        }

        let savedEvent = await newEvent.save();
        await Stats.insertEvent();

        // Update each category to add the new event's ID to their 'eventList' array 
        await Promise.all(
            categoryFilter.map(async (category) => {
                category.eventList.push(savedEvent._id); 
                await category.save();
            })
        );
        
        //Return a response with the event ID.
        res.status(200).json({ eventId: savedEvent.id });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
},
  /**
     * list all the events in the event database and the details for their categories. 
     *
     * @async
     * @function
     * @param {Object} 
     * @param {Object} 
     * @returns {Object} all events in a JSON format.
     */
	listallEvents: async function (req, res) {
		try {
        let events = await Event.find().populate("categoryList").exec();
          res.status(200).json(events);
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
	},
  /**
     * delete event from the database based on inputted event ID.
     * Also removes the deleted event's object ID in the 'eventList' array in all the categories
     *
     * @async
     * @function
     * @param {Object} req - Object containing the event ID. Given in a JSON format.
     * @param {Object} res 
     * @returns {Object} A JSON object containing acknowledgment and count of the deleted events.
     */
	deletebyID: async function (req, res) {
    try {
        let eventId = req.body.eventId;

        // Find the event by ID before deleting to return it in the response
        let eventidDeleted = await Event.findOne({ id: eventId });

        if (!eventidDeleted) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Delete the event by ID
        let deletedEventInfo = await Event.findOneAndDelete({ id: eventId });

        if (deletedEventInfo) {
          await Stats.deleteEvent();
        }

        // Find all categories that reference the deleted event
        let categories = await EventCategory.find({ eventList: deletedEventInfo._id });

        // Remove the deleted event's ObjectId from each category's eventsList
        await Promise.all(
            categories.map(async (category) => {
                let index = category.eventList.indexOf(deletedEventInfo._id);
                if (index !== -1) {
                    category.eventList.splice(index, 1);
                    await category.save();
                }
            })
        );

        res.status(200).json({
            acknowledged: !!deletedEventInfo, // This will be true if there's a deleted event, otherwise false
            deletedCount: deletedEventInfo ? 1 : 0
        });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
},
  /**
     * update event name and capacity based on the inputted event ID.
     *
     * @async
     * @function
     * @param {Object} req - Object containing the event ID, new name, and capacity. Given in a JSON format.
     * @param {Object} res 
     * @returns {Object} A JSON object containing the status of the update operation.
     */
  updateEvent: async function (req, res) {
    try {
        const { eventId, name, capacity } = req.body;

        const result = await Event.findOneAndUpdate({ id: eventId }, { $set: { name, capacity } }, { new: true });

        if (result) {
            res.status(200).json({ status: 'updated successfully' });
            await Stats.updateRecord();
        } else {
            res.status(404).json({ status: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
