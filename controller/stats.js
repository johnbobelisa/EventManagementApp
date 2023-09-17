/**
 * This file is required to modify the stats in the database
 * @author Yi Mei Lee, John Bob
 */

/**
 * Operation constant from model
 * @const
 */
const Operation = require("../models/operation");


module.exports = {
    /**
     * insert Operation
     * to ensure the database have at least one operation data
     * 
     * @name insertOperation
     * @function
     */
    // used to make sure there always have one and only one data in the operation database for stats to work
    insertOperation: async function() {
        try {
            // create new operation and save to database
            let newOperation = new Operation();
            await newOperation.save()

            // check if operation available if yes delete excess 
            let allOperations = await Operation.find();
            // if no operation found, create new one, else do nothing
            if(allOperations.length > 1){
                await Operation.deleteOne({_id: newOperation._id});;
            }  
        }
        catch (error) {
            console.log("error inserting operation")
        }
        
    },
   /**
    * insert category function
    * called if inserting new category to update stats
    * @name insertCategory
    * @function
    */
    insertCategory: async function() {
        await Operation.updateOne({}, {$inc: {categoryCount: 1, recordsCreated: 1}})
    },
    /**
    * insert event function
    * called if inserting new event to update stats
    * @name insertEvent
    * @function
    */
    insertEvent: async function() {
        await Operation.updateOne({}, {$inc: {eventCount: 1, recordsCreated: 1}})
    },
    /**
    * delete category function
    * called if deleting existing category to update stats
    * @name deleteCategory
    * @function
    */
    deleteCategory: async function() {
        await Operation.updateOne({}, {$inc: {categoryCount: -1, recordsDeleted: 1}})
    },
    /**
    * delete event function
    * called if deleting existing event to update stats
    * @name deleteEvent
    * @function
    */
    deleteEvent: async function() {
        await Operation.updateOne({}, {$inc: {eventCount: -1, recordsDeleted: 1}})
    },
    /**
    * update record function
    * called if there are any update called
    * @name updateRecord
    * @function
    */
    updateRecord: async function() {
        await Operation.updateOne({}, {$inc: {recordsUpdated: 1}})
    },
    /**
    * get stats function
    * called to get the stats data from database
    * @name getStat
    * @function
    */
    getStat: async function() {
        // ensure that there is operation data
        await this.insertOperation();

        return await Operation.findOne();
    }
}
