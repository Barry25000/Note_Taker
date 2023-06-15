//required packages
const express = require("express");
const path = require("path");
const uniqid = require("uniqid");
const fs = require("fs");

//assigning which port to listen to.
const PORT = 3001;

//creates new app with express
const app = express();

//middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// This view route is a GET route for the homepage
app.get(
  "/",
  (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")) //good from here up
);

// This view route is a GET route for the notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

//line 32
// This view route is a GET route for the db page
app.get("/api/notes", function (req, res) {
  fs.readFile("db/db.json", "utf8", (err, data) => {
    var jsonData = JSON.parse(data);
    console.log(jsonData);
    res.json(jsonData);
  });
});

//line 41
// Reads the newly added notes from the request body and then adds them to the db.json file
const readThenAppendToJson = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeNewNoteToJson(file, parsedData);
    }
  });
};

//line 54
// Writes data to db.json -> utilized within the readThenAppendToJson function
const writeNewNoteToJson = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

//line 60
// Post route -> receives a new note, saves it to request body, adds it to the db.json file, and then returns the new note to the client
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title: title,
      text: text,
      id: uniqid(),
    };

    readThenAppendToJson(newNote, "db/db.json");

    const response = {
      status: "success",
      body: newNote,
    };

    res.json(response);
  } else {
    res.json("Error in posting new note");
  }
});

//line 83
// Delete route -> reads the db.json file, uses the json objects uniqids to match the object to be deleted, removes that object from the db.json file, then re-writes the db.json file
app.delete("/api/notes/:id", (req, res) => {
  let id = req.params.id;
  let parsedData;
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      parsedData = JSON.parse(data);
      const filterData = parsedData.filter((note) => note.id !== id);
      writeNewNoteToJson("db/db.json", filterData);
    }
  });
  res.send(`Deleted note with ${req.params.id}`);
});

// app.get("/api/notes", (req, res) =>
//   res.sendFile(path.join(__dirname, "/db/db.json"))
// );

// // This API route is a POST Route for submitting feedback
// app.post("/api/notes", (req, res) => {
//   // Log that a POST request was received
//   console.info(`${req.method} request received to submit new note`);
//   console.log(req.body);

//   fs.readFile("./db/db.json", "utf8", (err, data) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(data);
//       // const parsedData = JSON.parse(data);
//       // parsedData.push(content);
//       // writeToFile(file, parsedData);
//     }
//   });
// });

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
