/**
 * The server file for this web page
 * @author Yi Mei Lee, John Bob
 */

/**
 * mongoose constant
 * @const
 */
const mongoose = require("mongoose");
// Main Server
// setting express constant
/**
 * express constant
 * @const
 */
const express = require("express");

// Routes for Event endpoints
/**
 * eventRouter constant
 * @const
 */
const eventRouter = require("./routes/event");
/**
 * eventAPIRouter constant
 * @const
 */
const eventAPIRouter = require("./routes/event-api");
/**
 * categoryAPIRouter constant
 * @const
 */
const categoryAPIRouter = require("./routes/category-api-route");
/**
 * categoryRouter constant
 * @const
 */
const categoryRouter = require("./routes/category-route");

// setting path constant
/**
 * path constant
 * @const
 */
const PATH = require("path");

// setting port number constant
/**
 * port number constant
 * @const
 */
const  PORT_NUMBER = 8080;
;

// setting print variable to access console.log quickly
let print = console.log;

// create app instance of express
let app = express();

// using bootstrap
app.use(express.static("node_modules/bootstrap/dist/css"))

// linking to img file to access images
app.use("/img", express.static(PATH.join(__dirname, "/img")))

// setting the template engine to be html (html file will be render as view)
app.set('view engine', 'html');

// ejs allows to embed JS code into html template, easier to generate dynamic html content
app.engine('html', require('ejs').renderFile);

// used to parse incoming requrest bodies to access req.body
app.use(express.urlencoded({ extended: true }));

// allows the server to receive JSON data from client requests and parse it into a JavaScript object
app.use(express.json());

// listen to port number
/**
 * Configure port number
 * @name listen
 * @function
 */
app.listen(PORT_NUMBER, function () {
    print(`listening on port ${PORT_NUMBER}`);
  })

  /**
   * url constant
   * @const
   */
const url = "mongodb://127.0.0.1:27017/quantumpanda";

/**
 * function to connect mongoose url
 * @name connect
 * @function
 */
async function connect(url) {
	await mongoose.connect(url);
	return "Connected Successfully";
}
/**
 * connect to the database
 */
connect(url)
	.catch((err) => console.log(err));

/**
 * stats controller constant
 * @const
 */
const Stats = require("./controller/stats")
Stats.insertOperation();

/**
 * Route serving main page
 * @name get/
 * @function
 */
app.get('/', async function (req, res) {
  let statsResult = await Stats.getStat();
  
  res.render("index", {stat: statsResult});
  });


// setting up router urls
/**
 * Route serving Student 2 task page (API)
 * @name use/John
 * @function
 */
app.use("/John", eventAPIRouter);
/**
 * Route serving Student 2 task page
 * @name use/John
 * @function
 */
app.use("/John", eventRouter);
/**
 * Route serving Student 1 task page (API)
 * @name use/category/33254834/api/v1
 * @function
 */
app.use("/category/33254834/api/v1", categoryAPIRouter);
/**
 * Route serving Student 1 task page
 * @name use/category/33254834/
 * @function
 */
app.use("/category/33254834", categoryRouter);

/**
 * Route for handling unmatched routes.
 *
 * @name get/*
 * @function
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
app.get("*", function(req, res) {
  res.render("404-not-found");
});


