const express = require('express');
const app = express();
// app.disable("x-powered-by").create({dafaultLayout:"main"});
const handlebars = require('express-handlebars').create({defaultLayout:"main"});
app.engine("handlebars", handlebars.engine);
app.set("view engine", handlebars);
//more imports go here
app.set("port", process.env.PORT || 3000);
app.use(express.static(__dirname + "/public"));




app.get("/", (req, res)=>{
  res.render("home")
})

app.listen(3000, function () {
  console.log('listening');
});
