//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});


const articleSchema = new mongoose.Schema({
  title: String,
  body : String
});
const Article = mongoose.model("Article", articleSchema);


//
// targeting all articles  route
//
app.route("/articles")
.get(function(req,res){
 Article.find({},function(err,foundArticles){
   if(err)
   {
     res.send(err);
   }
   else
   {
     res.send(foundArticles);
   }

 });
})
.post(function(req,res){
const newArticle = new Article({
    title : req.body.title,
    body : req.body.body
  });
newArticle.save(function(err){
  if (!err) {
    res.send("successfully added a new article.");
  } else {
    res.send(err);
  }
});
})
.delete(function(req,res){
  Article.deleteMany({},function(err){
    if (!err) {
      res.send("successfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});

//
// targeting specific route
//
app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title : req.params.articleTitle},function(err,foundArticle){
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles found");
    }
  });
})
.put(function(req,res){
  Article.updateOne({title : req.params.articleTitle},
    {title : req.body.title,
    body : req.body.body},
    {overwrite : true},
    function(err){
      if (!err) {
        res.send("put request success");
      } else {
        res.send(err);
      }
    }
  );
})
.patch(function(req,res){
  Article.updateOne({title :req.params.articleTitle},
    {$set:req.body},
    function(err){
      if (!err) {
        res.send("patch successful.");
      } else {
          res.send(err);
      }
    });
})
.delete(function(req,res){
  Article.deleteOne({title : req.params.articleTitle },function(err){
    if (!err) {
      res.send("particular article deleted.");
    } else {
          res.send(err);
    }
  });
});


let port = process.env.PORT;
if(port == null || port =="")
{
  port = 3000;
}

app.listen(port, function() {
  console.log("server running !");
});
