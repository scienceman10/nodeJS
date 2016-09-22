const express = require('express');
const app = express();
//app.disable("x-powered-by").create({dafaultLayout:"main"});
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
  res.render("home", {title:"home"})
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

app.get('/file-upload', (req, res)=>{
  var now = new Date();
  res.render('file-upload',{
    year: now.getFullYear(),
    month: now.getMonth() });
});

app.post("/file-upload/:year/:month", (req, res)=>{
  var form = new formidable.IncomingForm();
  form.parse(req, (err, fields, file)=>{
    if (err)
      return res.redirect(303, "/500");
    console.log("upload form accepted");
    console.log(file);
    res.redirect(303, "/thankyou")
  })
})

app.use((req, res)=>{
  res.type("text/html");
  res.status(404);
  res.render("404", {title:"404 not found", layout:"second"});
});

app.use((err, req, res, next)=>{
  console.log(err.stack);
  res.status(500);
  res.render("500");
})

app.listen(3000, function () {
  console.log('app started');
});
