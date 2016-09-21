const express = require('express');
const app = express();
// app.disable("x-powered-by").create({dafaultLayout:"main"});
const handlebars = require('express-handlebars').create({defaultLayout:"main"});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.use(require("body-parser").urlencoded({extended:true}));
const formidable = require('formidable');
const credentials = require('./credentials');
app.use(require("cookie-parser")(credentials.cookiePass))
//more imports go here
app.set("port", process.env.PORT || 3000);
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res)=>{
  res.render("home")
});

app.get("/about", (req, res)=>{
  res.render("about");
});

app.get("/contact", (req, res)=>{
  res.render('contact', { csrf: 'CSRF token here' });
});

app.get("/thankyou", (req, res)=>{
  res.render("thankyou")
});

app.post('/process', function(req, res){
  console.log('Form : ' + req.query.form);
  console.log('Email : ' + req.body.email);
  console.log('Question : ' + req.body.ques);
  res.redirect(303, '/thankyou');
});


app.use((req, res)=>{
  res.type("text/html");
  res.status(404);
  res.render("404");
});

app.use((err, req, res, next)=>{
  console.log(err.stack);
  res.status(500);
  res.render("500");
})

app.listen(3000, function () {
  console.log('app started');
});
