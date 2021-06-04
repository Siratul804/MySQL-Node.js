const express = require("express");
const app = express();
const mysql = require("mysql");
const { urlencoded } = require("body-parser");
const cors = require("cors");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud_database",
});

app.use(cors());
app.use(express.json());

app.post("/api/insert", (req, res) => {
  const movieName = req.body.movieName;
  const movieReview = req.body.movieReview;

  const sqlInsert =
    "INSERT INTO movie_review (movieName, movieReview) VALUES (?,?)";
  db.query(sqlInsert, [movieName, movieReview], (error, result) => {
    console.log(result);
  });
});

app.delete("/api/delete/:movieName", (req, res) => {
  const name = req.params.movieName;
  const sqlDelete = "DELETE FROM movie_review WHERE movieName = ?";

  db.query(sqlDelete, name, (err, result) => {
    if (err) console.log(err);
  });
});

app.put("/api/update", (req, res) => {
  const name = req.body.movieName;
  const review = req.body.movieReview;

  const sqlUpdate =
    "UPDATE movie_review SET movieReview = ? WHERE movieName = ?";

  db.query(sqlUpdate, [review, name], (err, result) => {
    if (err) console.log(err);
  });
});

app.get("/api/get", (req, res) => {
  const sqlSelect = "SELECT * FROM movie_review";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

// app.get("/", (req, res) => {
//   const sqlInsert =
//     "INSERT INTO movie_review (movieName, movieReview) VALUES ('inception', 'good movie');";
//   db.query(sqlInsert, (error, result) => {
//     res.send("done");
//   });
// });

app.listen(3001, () => {
  console.log("running on port 3001");
});
