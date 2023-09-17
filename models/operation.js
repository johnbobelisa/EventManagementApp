/**
 * This file is for the operation schema
 * @author Yi Mei Lee, John Bob
 */

/**
 * mongoose constant
 * @const
 */
const mongoose = require('mongoose');

/**
 * operation schema constant
 * @const
 */
const operationSchema = mongoose.Schema({
    /**
     * category count in database
     */
    categoryCount: {
        type: Number,
        default: 0
    },
    /**
     * event count in database
     */
    eventCount: {
        type: Number,
        default: 0
    },
    /**
     * record created count in database
     */
    recordsCreated: {
        type: Number,
        default: 0,
    },
    /**
     * record deleted count in database
     */
    recordsDeleted: {
        type: Number,
        default: 0,
    },
    /** 
     * record updated count in database
     */
    recordsUpdated: {
        type: Number,
        default: 0,
    }
});

/**
 * export module
 */
module.exports = mongoose.model('Operations', operationSchema);
