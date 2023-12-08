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

  const { title, text, id } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id,
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
    const id = parseInt(req.params.id);
  
    // Use filter to create a new array without the note to be deleted
    const updatedNotes = dbJson.filter(note => note.id !== id);
  
    if (updatedNotes.length < dbJson.length) {
      // Note was found and removed, update the file and respond
      fs.writeFile("./db/db.json", JSON.stringify(updatedNotes, null, 4), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
        } else {
          console.log("Your note has been deleted!");
          res.json(updatedNotes);
        }
      });
    } else {
      // Note with the specified ID was not found
      console.log("Note not found.");
      res.status(404).json({ error: "Note not found" });
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
