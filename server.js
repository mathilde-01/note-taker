// express import
const express = require("express");

// database path
const dbJson = require("./db/db.json");

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

// post read and write methods
app.post("/api/notes", (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      // id
    };
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const oldNotes = JSON.parse(data);
        oldNotes.push(newNote);
        fs.writeFile("./db/db.json", JSON.stringify(oldNotes, null, 4), (err) =>
          err ? console.error(err) : res.json({ message: "New note added" })
        );
      }
    });
  }
});

// Delete note
app.delete("/api/notes/:id", (req, res) => {
    let deletedNote = parseInt(req.params.id);
    console.log(deletedNote);

    for (let i = 0; i < dbJson.length; i++) {
        if (deletedNote === dbJson[i].id) {
            dbJson.splice(i, 1);

            let noteJson = JSON.stringify(dbJson, null, 2);
            console.log(noteJson);
            fs.writeFile("./db/db.json", noteJson, function (err) {
                if (err) throw err;
                console.log("Your note has been deleted!");
                res.json(dbJson);
            });
        }
    }
});

// GET Route for homepage
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// if no matching route is found, default to home
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// listen
app.listen(PORT, () => {
  console.log(`app is listening on http://localhost:${PORT}`);
});
