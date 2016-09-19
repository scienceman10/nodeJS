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
  res.render("about")
});

app.get("/contact", (req, res)=>{
  app.render("contact", {csrf:"csrf token here"})
});

app.get("/thankyou", (req, res)=>{
  res.render("thankyou")
});

app.post("/process", (req, res)=>{
  console.log("csrf:"+req.body._csrf);
  console.log("email:"+req.body.email);
  console.log("question:"+req.body.ques);
  res.redirect(303, "thankyou");
})

app.get('/file-upload', (req, res)=>{
  var now = new Date();
  res.render('file-upload',{
    year: now.getFullYear(),
    month: now.getMonth() });
  });

app.post('/file-upload/:year/:month',(req, res)=>{
    // Parse a file that was uploaded
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, file){
      if(err)
        return res.redirect(303, '/error');
      console.log('Received File');

      // Output file information
      console.log(file);
      res.redirect( 303, '/thankyou');
  });
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
  console.log('listening');
});
