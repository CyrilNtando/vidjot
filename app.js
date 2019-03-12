//get express
const express = require("express");
//get handlebars
const exphbs = require("express-handlebars");
//get mongoose
const mongoose = require("mongoose");

//init app by calling the express function
const app = express();

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;
//connect to mongoose
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
//handlebars Middleware
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

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

//set port to 5000
const port = 5000;
//listen to port
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
