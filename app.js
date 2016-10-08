//start of setup
const express = require('express');
const app = express();
app.disable('x-powered-by');//security stuff
const handlebars = require('express-handlebars').create({defaultLayout:"main"});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.use(require("body-parser").urlencoded({extended:true}));
const formidable = require('formidable');
const credentials = require('./credentials');
app.use(require("cookie-parser")(credentials.cookiePass));
const fs = require('fs');
//more imports go here
app.set("port", process.env.PORT || 3000);
app.use(express.static(__dirname + "/public"));
//end of setup

app.get("/", (req, res)=>{
  if (req.cookies.username) {
    res.render("home", {title:"home", name: "Welcome Back, " + req.cookies.username})
  } else {
    res.render("home", {title:"home"})
  }
});

app.get("/about", (req, res)=>{
  res.render("about", {title:"about"});
});

app.get("/contact", (req, res)=>{
  res.render('contact', { csrf: 'CSRF token here', title:"contact us" });
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

app.post("/remember", (req, res)=>{
  res.cookie("username", req.body.name, {expires: new Date(Date.now() + 5 * 7 * 24 * 900000), httpOnly: true }).render("thankyou");
  console.log("form cookieset set cookie:" + req.body.name);
})

app.get('/file-upload', (req, res)=>{
  var now = new Date();
  res.render('file-upload',{
    year: now.getFullYear(),
    month: now.getMonth(), title:"file submition" });
});

app.post("/file-upload/:year/:month", (req, res)=>{
  var form = new formidable.IncomingForm();
  form.parse(req, (err, fields, file)=>{
    if (err)
      return res.redirect(303, "/500");
    console.log("upload form accepted");
    console.log(file);
    res.redirect(303, "/thankyou");
  })
});

app.get("/remember", (req, res)=>{
  res.render("remember", {title:"get site cookie"})
});

app.get("/forget", (req, res)=>{
  console.log(req.cookies.username + " forgoten");
  res.clearCookie("username");
  res.render("home", {name: "you've been forgotten"})
});

const session = require('express-session');

const parseurl = require('parseurl');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: credentials.cookiePass,
}));

app.use(function(req, res, next){
  var views = req.session.views;

  if(!views){
    views = req.session.views = {};
  }

  var pathname = parseurl(req).pathname;

  views[pathname] = (views[pathname] || 0) + 1;

  next();

});

app.get('/viewcount', function(req, res, next){
  res.send('You viewed this page ' + req.session.views['/viewcount'] + ' times ');
});

app.get('/printfile', (req, res)=>{
  fs.readFile('./public/' + req.query.file + '.txt', function (err, data) {
   if (err) {
       return console.error(err);
   }
   res.send(data.toString());
  });

});

app.get("/file", (req, res)=>{
  res.render("file");
})

app.post("/file", (req, res)=>{
  fs.writeFile('./public/' + req.body.fname + ".txt",
    req.body.file, ()=>{
      res.redirect(303, "/thankyou")
      /*fs.readFile("./public/" + req.body.fname, function (err, data) {
       if (err) {
           return console.error(err);
           res.redirect()
       }
       res.send(data.toString());
     });*/
  });

})

app.use((req, res)=>{
  res.type("text/html");
  res.status(404);
  res.render("404", {title:"404 not found"});
});

app.use((err, req, res, next)=>{
  console.log(err.stack);
  res.status(500);
  res.render("500");
})

app.listen(3000, function () {
  console.log('app started');
});
