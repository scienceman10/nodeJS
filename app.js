const express = require('express');
const app = express();
// app.disable("x-powered-by").create({dafaultLayout:"main"});
const handlebars = require('express-handlebars');
app.engine("handlebars", handlebars.engine);
app.set("view engine", handlebars);
//more imports go here
app.set("port", process.env.PORT || 3000);
app.use(express.static(__dirname + "/public"));



/*app.get('/', function (req, res) {
  res.send('<h1 style="text-align:center">my website</h1>');
});

app.listen(3000, function () {
  console.log('listening');
});*/
