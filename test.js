var fs = require("fs");
var entries = [];

var syncEntries = function() {
  fs.writeFile('files/entries.json', JSON.stringify( entries ), function(error, data) {
    console.log(data);
  });
}

var loadJsonFile = fs.readFileSync("files/entries.json", "utf8");
entries = JSON.parse(loadJsonFile);
console.log(JSON.stringify( entries ));

var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var uuidV4 = require ("uuid/v4");

var entryID = uuidV4();
console.log(entryID);

var app = express();

var staticPath = path.join(__dirname, 'styles');
app.use(express.static(staticPath));

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
	    published: new Date(),
      id: entryID
});
  console.log(JSON.stringify( entries ));

  syncEntries();

  response.redirect("/");
});

app.get("/entries/:entryID", function(req, res) {
  var gesuchteId = req.params.entryID;
  var foundIndex = -1;

  for (var i = 0; i < entries.length; i++) {
    if (entries[i].id === gesuchteId) {
      foundIndex = i;
      break;
    }
  }
  if (foundIndex >= 0) {
    entries.splice(foundIndex, 1);
    syncEntries();
  } else {res.send("Kein Index gefunden")};

  res.redirect("/");

});

app.use(function(request, response) {
  response.status(404).render("404");
});

http.createServer(app).listen(3000, function() {
  console.log("Guestbook app started on port 3000.");
});