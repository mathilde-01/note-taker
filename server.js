// express import
const express = require("express");
// path
const path = require("path");

// file system module import
const fs = require("fs");

// app creation with express
const app = express();

// port
const PORT = process.env.PORT || 3001;

// middleware
app.use(express.static("public"));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// get route
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parseData = JSON.parse(data);
      res.json(parseData);
    }
  });
});

// GET Route for homepage
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// listen
app.listen(PORT, () => {
  console.log(`app is listening on http://localhost:${PORT}`);
});
