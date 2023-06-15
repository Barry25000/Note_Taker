const express = require("express");
const path = require("path");
const fs = require("fs");
const PORT = 3001;

const app = express();

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) =>
//   res.sendFile(path.join(__dirname, "/public/index.html"))
// );

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/db/db.json"))
);

app.post("/api/notes", (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to submit new note`);
  console.log(req.body);
});

fs.readFile("./db/db.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(data);
    //   const parsedData = JSON.parse(data);
    //   parsedData.push(content);
    //   writeToFile(file, parsedData);
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
