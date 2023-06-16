//required packages
const express = require("express");
const path = require("path");
const fs = require("fs");
const uniqid = require("uniqid");

//assigning port to listen to.
const PORT = 3001;

//creates new app with express
const app = express();

//middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET route for the homepage
app.get(
  "/",
  (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")) //good from here up
);

// GET route for the notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// GET route for the db page
app.get("/api/notes", function (req, res) {
  fs.readFile("db/db.json", "utf8", (err, data) => {
    var jsonData = JSON.parse(data);
    console.log(jsonData);
    res.json(jsonData);
  });
});

// Reads new note and parses data
const newArray = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      newArrayWrite(file, parsedData);
    }
  });
};

// Writes note data to db
const newArrayWrite = (arrayData, content) =>
  fs.writeFile(arrayData, JSON.stringify(content, null, 2), (err) =>
    err ? console.error(err) : console.info(`\nNote written to ${arrayData}`)
  );

// Posting http request
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title: title,
      text: text,
      id: uniqid(),
    };

    newArray(newNote, "db/db.json");

    const response = {
      status: "Success, added new note.",
      body: newNote,
    };

    res.json(response);
  } else {
    res.json("Error posting new note.");
  }
});

// Delete, uses uniqid to find the correct note to delete
app.delete("/api/notes/:id", (req, res) => {
  let id = req.params.id;
  let parsedData;
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      parsedData = JSON.parse(data);
      const filteredData = parsedData.filter((note) => note.id !== id);
      newArrayWrite("db/db.json", filteredData);
    }
  });
  res.send(`Deleted note with ${req.params.id}`);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
