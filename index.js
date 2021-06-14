const express = require("express");
const app = express();
const mysql = require("mysql");
const morgan = require("morgan");
const cors = require("cors");

const multer = require("multer");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud_database",
});

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(
  express.urlencoded({
    extended: false,
  })
);

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

const store = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const filerFilter = (req, file, cb) => {
  cb(null, true);
};

let upload = multer({
  storage: store,
  fileFilter: filerFilter,
});

app.post("/api/image", upload.single("image"), (req, res) => {
  console.log(req.file);

  var sqlImage =
    "INSERT INTO image (image) VALUES ('" + req.file.originalname + "')";
  db.query(sqlImage, (error, result) => {
    console.log("inserted data");
  });
});

app.post("/api/test", upload.single("image"), (req, res) => {
  const resp = req.file.originalname;
  console.log(resp);
});

app.get("/api/get/image", (req, res) => {
  const sqlSelect = "SELECT * FROM image";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

// app.post("/api/image", function (req, res) {
//   upload.single("image")(req, res, function (error) {
//     if (error) {
//       console.log(`upload.single error: ${error}`);
//     } else {
//       var sqlImage =
//         "INSERT INTO image (image) VALUES ('" + req.file.originalname + "')";
//       db.query(sqlImage, (error, result) => {
//         console.log("inserted data");
//       });
//     }
//   });
// });

app.get("/", (req, res) => {
  const sqlInsert =
    "INSERT INTO movie_review (movieName, movieReview) VALUES ('', '');";
  db.query(sqlInsert, (error, result) => {
    res.send("done");
  });
});

app.listen(3001, () => {
  console.log("running on port 3001");
});
