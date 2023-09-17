const mongoose = require('mongoose');

/**
 * This class represents an event with its details and methods.
 * @class
 */
const eventSchema = new mongoose.Schema({
  /**
   * The Event name.
   */
  name: {
    type: String,
    required: true
  },
  /**
   * The description of the event.
   */
  description: {
    type: String,
    default: ''
  },
  /**
   * The start dateTime of the event.
   */
  startDateTime: {
    type: Date,
    required: true
  },
  /**
   * The duration of the event in minutes.
   */
  durationInMinutes: {
    type: Number,
    required: true
  },
  /**
   * Whether the event is active or not.
   */
  isActive: {
    type: Boolean,
    default: true
  },
  /**
   * The image URL of the event.
   */
  image: {
    type: String,
    default: "event.png"
  },
  /**
   * The capacity of the event.
   */
  capacity: {
    type: Number,
    default: 1000,
    validate: {
      validator: function (value) {
        return value >= 10 && value <= 2000;
      },
      message: "capacity not in between 10 and 2000 (inclusive)"
    },
  },
  /**
   * The number of available tickets for the event.
   */
  ticketsAvailable: {
    type: Number,
    validate: {
      validator: function(value) {
        if (!value && value != 0) {
          this.ticketsAvailable = this.capacity;
        }
      }
    }
  },
  /**
   * The category ID of the event.
   */
  categoryId: {
    type: String,
    required: true
  },
  /**
   * Unique event ID.
   */
  id: {
    type: String,
    unique: true,
    default: function () {
      return this.ID();
    },
  },
  /**
   * The end dateTime of the event.
   */
  endDateTime: {
    type: Date,
    default: function() {
      return this.endDateTimes();
    }
  },
  categoryList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category' // Reference to the EventCategory model
    },
  ]
});

/**
 * Generates 3 random uppercase letters.
 * @returns {string} Random letters.
 */
eventSchema.methods.generateRandomletters = function () {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 2; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * 26));
  }
  return result;
};

/**
 * Generates a random four-digit.
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @returns {number} Random four-digit number.
 */
eventSchema.methods.generateFourDigits = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a unique ID for the event.
 * @returns {string} Unique event ID.
 */
eventSchema.methods.ID = function () {
  const start = 'E' + this.generateRandomletters();
  const FourDigits = this.generateFourDigits(1000, 9999);
  return `${start}-${FourDigits}`;
};

/**
 * Generates endDateTimes by adding the 
 * start time and duration of the event.
 * @returns {Date} DateTime for the end of the event. 
 */

eventSchema.methods.endDateTimes = function() {
  const START_TIME = this.startDateTime.getTime(); 
  const DURATION_TIME = this.durationInMinutes * 60 * 1000;
  return new Date(START_TIME + DURATION_TIME);
};

// Create and export the Event model based on the schema

module.exports = mongoose.model("Event", eventSchema);

