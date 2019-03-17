const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { ensureAuthenticated } = require("../helpers/auth");
//Load Idea Model
require("../models/Idea");
const Idea = mongoose.model("ideas");

// Define Route Ideas
//Idea Index page
router.get("/", ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: "desc" }) //sort by date in descending order
    .then(ideas => {
      res.render("ideas/index", {
        //send data or ideas to temaplate/html
        ideas: ideas
      });
    });
});
//Add idea Form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("ideas/add");
});
//Edit idea Form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  //:id is the place holder of the actually Idea
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    if (idea.user != req.user.id) {
      req.flash("error_msg", "Not Athourised");
      res.redirect("/ideas");
    } else {
      res.render("ideas/edit", {
        idea: idea
      });
    }
  });
});

//Process From
router.post("/", ensureAuthenticated, (req, res) => {
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
      details: req.body.details,
      user: req.user.id
    };
    new Idea(newUser).save().then(idea => {
      req.flash("success_msg", "video idea added");
      res.redirect("/ideas");
    });
  }
});

//Edit Form process
router.put("/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    //new values
    (idea.title = req.body.title), (idea.details = req.body.details);
    idea.save().then(idea => {
      req.flash("success_msg", "video idea updated");
      res.redirect("/ideas");
    });
  });
});
//Delete Idea
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Idea.remove({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "video idea removed");
    res.redirect("/ideas");
  });
});

module.exports = router;
