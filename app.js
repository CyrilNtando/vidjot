//get express
const express = require("express");
//get handlebars
const exphbs = require("express-handlebars");
// get method override
const methodoverride = require("method-override");
//get body parser
const bodyParser = require("body-parser");
//get mongoose
const mongoose = require("mongoose");

/************************************************************************************* */
//init app by calling the express function
const app = express();

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
//Load Idea Model
require("./models/Idea");
const Idea = mongoose.model("ideas");

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
//method override Middleware
app.use(methodoverride("_method"));
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
//Idea Index page
app.get("/ideas", (req, res) => {
  Idea.find({})
    .sort({ date: "desc" }) //sort by date in descending order
    .then(ideas => {
      res.render("ideas/index", {
        //send data or ideas to temaplate/html
        ideas: ideas
      });
    });
});
//Add idea Form
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});
//Edit idea Form
app.get("/ideas/edit/:id", (req, res) => {
  //:id is the place holder of the actually Idea
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render("ideas/edit", {
      idea: idea
    });
  });
});

//Process From
app.post("/ideas", (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push("Please add a title");
  }
  if (!req.body.details) {
    errors.push("Please add some details");
  }
  if (errors.length > 0) {
    //passing Information into client html
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Idea(newUser).save().then(idea => {
      res.redirect("/ideas");
    });
  }
});

//Edit Form process
app.put("/ideas/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    //new values
    (idea.title = req.body.title), (idea.details = req.body.details);
    idea.save().then(idea => {
      res.redirect("/ideas");
    });
  });
});
//Delete Idea
app.delete("/ideas/:id", (req, res) => {
  Idea.remove({ _id: req.params.id }).then(() => res.redirect("/ideas"));
});

/************************************************************************************* */
//set port to 5000
const port = 5000;
//listen to port
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
