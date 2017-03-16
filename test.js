var fs = require("fs");
var entries = [];

var loadJsonFile = fs.readFileSync("files/entries.json", "utf8");
entries = JSON.parse(loadJsonFile);
console.log(JSON.stringify( entries ));

var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");

var app = express();

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.locals.entries = entries;

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(request, response) {
  response.render("index");
});

app.get("/new-entry", function(request, response) {
  response.render("new-entry");
});

app.post("/new-entry", function(request, response) {
  if (!request.body.title || !request.body.body) {
   	response.status(400).send("Bitte beide Felder ausfüllen.");
	return;
}
	entries.push({
	    title: request.body.title,
	    content: request.body.body,
	    published: new Date()
});
  console.log(JSON.stringify( entries ));

    fs.writeFileSync('files/entries.json', JSON.stringify( entries ), function(error, data) {
      console.log(data);
    });

  response.redirect("/");
});

app.use(function(request, response) {
  response.status(404).render("404");
});

http.createServer(app).listen(3000, function() {
  console.log("Guestbook app started on port 3000.");
});