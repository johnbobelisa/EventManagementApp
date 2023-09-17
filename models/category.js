/**
 * this file is for category schema
 * @author Yi Mei Lee
 */
/**
 * mongoose constant
 * @const
 */
const mongoose = require("mongoose");

/**
 * category schema constant
 * @const
 */
const categorySchema = mongoose.Schema({
    /**
     * the id of the category 
     */
    id: {
        type: String,
        unique: true,
        default: function() {
            return generateId();
        }
    },
    /**
     * the name of category (alphanumeric)
     */
	name: {
        type: String,
        require: true,
        validate: {
            validator: function(input) {
                return /^[A-Za-z0-9 ]+$/.test(input);
            },
            message: "name must be alphanumeric"
        }
    },
    /**
     * description of category
     */
    description: {
        type: String
    },
    /**
     * image path of category
     */
    image: {
        type: String,
        default: "/img/category-cell-img.png"
    },
    /**
     * created date of the category
     */
    createdDate: {
        type: Date,
        default: Date.now
    },
    /**
     * related events of the category
     */
    eventList: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
		},
	]
});

/**
 * Generates random uppercase letters.
 * @name generateRandomletters
 * @function
 * @returns {string} Random letters.
 */
generateRandomletters = function() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 2; i++) {
        result += alphabet.charAt(Math.floor(Math.random() * 26));
    }
    return result;
}

/**
 * Generates a random four-digit number.
 * @name generateFourDigits
 * @function
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @returns {number} Random four-digit number.
 */
generateFourDigits = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates an ID for the event category.
 * @name generateId
 * @function
 * @returns {string} event category ID.
 */
generateId = function() {
    const start = 'C' + generateRandomletters();
    const FourDigits = generateFourDigits(1000, 9999);
    return `${start}-${FourDigits}`;
}

/**
 * export the module
 */
module.exports = mongoose.model("Category", categorySchema);