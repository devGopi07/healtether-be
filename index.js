require("dotenv").config();
const express = require("express");
const app = express();
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const { default: mongoose } = require("mongoose");
const { dbUrl } = require("./common/dbConfig");
const PORT = process.env.PORT || 8001;
const userRoutes = require("./routes/userRoutes"); 

mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected to the database successfully."))
  .catch((error) => {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // Exit on failed connection
  });

// middlewares
app.use(express.json());
app.use(cors());
app.use(logger("dev"));
app.use(cookieParser());

// routes
app.use("/api/users", userRoutes); 

app.listen(PORT, () => console.log("App Is Listening To", PORT));
