//get express
const express = require("express");
//get path
const path = require("path");
//get handlebars
const exphbs = require("express-handlebars");
// get method override
const methodoverride = require("method-override");
//get connect flash for sending messages
const flash = require("connect-flash");
const session = require("express-session");
//get passport
const passport = require("passport");
//get body parser
const bodyParser = require("body-parser");
//get mongoose
const mongoose = require("mongoose");
/************************************************************************************* */
//init app by calling the express function
const app = express();
//Load Routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");
//passport config
require("./config/passport")(passport);

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;
//connect to mongodb using mongoose
mongoose
  .connect("mongodb://localhost/vidjot-dev", {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("mangodb connected");
  })
  .catch(err => console.log(err));
/*********************************Mindleware**************************************************** */
//handlebars Middleware
//using handlebars as html render engine
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//static folder
app.use(express.static(path.join(__dirname, "public")));
//method override Middleware
app.use(methodoverride("_method"));
//Express sessions middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
    //cookie: { secure: true }
  })
);
//!important put passport middleware after session
app.use(passport.initialize());
app.use(passport.session());

//connect flash middleware
app.use(flash());

//Global variables
app.use((req, res, next) => {
  //this is for success message
  res.locals.success_msg = req.flash("success_msg");
  //this is for error message
  res.locals.error_msg = req.flash("error_msg");
  //for error only used in passport
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});
/************************************************************************************* */
/** *setting routes**/
//index route
app.get("/", (req, res) => {
  const title = "welcome";
  res.render("index", {
    title: title
  });
}); //get request
//about route
app.get("/about", (req, res) => {
  res.render("about");
});

/************************************************************************************* */
//Use routes
app.use("/ideas", ideas);
app.use("/users", users);
//set port to 5000
const port = 5000;
//listen to port
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
