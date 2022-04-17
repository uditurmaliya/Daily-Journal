const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogsDB");

const blogSchema = new mongoose.Schema({
  title:String,
  content:String
});

const Blog = mongoose.model("Blog", blogSchema);

const blog = new Blog({
  title: "Day 1",
  content: "Good Morning!"
});
// blog.save();   // only once otherwise added each time --> use node if using this save method

const Blogs = [];   // global empty array


app.get("/", function(req, res) {

  Blog.find({}, function(err, foundBlogs){
    res.render("home",{
      startingContent:homeStartingContent, 
      Blogs:foundBlogs
    });
  })

});

app.get("/about", function(req, res) {
  res.render("about", {aboutContent:aboutContent});
});

app.get("/contact", function(req, res) {
  res.render("contact", {contactContent:contactContent});  // passing data from app.js to contact.ejs
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

// express routing parameters
app.get("/Blogs/:blogName", function(req, res) {   // dynamic route/url
  // console.log(req.params.postName);  //op- news
  const requestedTitle = req.params.blogName;   // using lodash to ignore hyphen underscores and also for converting lowercase all
  // console.log(requestedTitle);

  Blog.findOne({title:requestedTitle}, function(err,foundBlog){
    if(err) {
      console.log(err);
    } else {
      if(foundBlog) {
        res.render("post", {
          postTitle: foundBlog.title,
          postContent: foundBlog.content
        })
      }
    }
  })
  
});  // url=> localhost:3000/posts/news

app.post("/compose", function(req, res) {
  const blog = new Blog({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  Blog.insertMany(blog, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("Blog is successfully inserted");
    }
  });

  res.redirect("/");

});


app.post("/delete", function(req, res) {

  const checkedBlogId = req.body.checkbox;

  Blog.findByIdAndRemove(checkedBlogId, function(err){
    console.log(err);
    res.redirect("/");
  });
});




app.listen(3000, function() {
  console.log("Server is running on port 3000");
});













