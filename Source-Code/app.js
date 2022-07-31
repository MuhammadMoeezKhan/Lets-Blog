//Use required npm modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose'); //mognoose database module ~ allows Node to connect with MongoDB Databases(collections,documents)

const homeStartingContent = "Heya! Welcome to the Daily Blog Web Application. My name is Moeez (full introduction in the about section) and it is my pleasure to provide you with a safe spot to express your daily feelings, events, experiences, and accomplishments! \n App Functionality: you can compose your blog by adding '/compose' to the current URL \n. You will be able to see all of your blog posts on this 'Home' page after composing!";
const aboutContent = "Hey! My name is Muhammad Moeez Khan (Mo) and I am a Rising Junior at DePauw University (Greencastle, Indiana). At college, I am a Computer Science major with a strong interest and drive for community growth utilizing the power of Software (Application and Web) Development alongside trying my best to lead/influence fellow students on-campus. Outside college, I am an entrepreneur and a fitness athlete, and love to cook (with some serious spices)! I originate from a small village in Pakistan, in Southern Asia, and fell in love with the American culture as I stepped foot here! Feel free to reach out and be in contact with me, I would love to talk with you! To learn more about my story, experiences, leadership, skills, and projects please explore my Portfolio website(linked in the footer): www.moeezkhan.com Plus. I would highly appreciate any sort of feedback/critique on my LinkedIn, GitHub, and/or Website!";
const contactContent = "I would love it if you reach out and connect with me. Glad to provide you with this app! All contact links are provided on my website which is linked in the footer on this webpage";

const app = express();

//to use EJS templates
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//to use static files --> styles.css
app.use(express.static("public"));

//connecting Node with the server
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

//creating a schema to track/store each blog post
const postSchema = {
  title: String,
  content: String
};

//creating a collection (table) that follows the postSchema
const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

//read all data stored in the Post collection(table)
  Post.find({}, function(err, posts){
    //use the home.ejs Express Layout
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

//@GET request to "/compose"
app.get("/compose", function(req, res){
  res.render("compose");
});


//@POST request to "/posts/:postId" ~ route paramter
app.post("/compose", function(req, res){

  //create a document(record) connected with the Post collection(table)
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

//insert the newly constructed post record into the Post collection
  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});


//@GET request to "/posts/:postId" ~ route paramter
app.get("/posts/:postId", function(req, res){

  //extract the route paramater added to the URL
  const requestedPostId = req.params.postId;

  //locating one document(record) with specified ID
    Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
        title: post.title,
        content: post.content
      });
    });
});


//@GET request to "/about" ~ route paramter
//uses the about.ejs Express Layout
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});


//@GET request to "/contact" ~ route paramter
//uses the contact.ejs Express Layout
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
