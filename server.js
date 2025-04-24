const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({path: "config.env"});

const categoryRoutes = require("./router/categoryRoute");
const dbConnection = require("./config/database");

//Connect to MongoDb
dbConnection();

// express app
const app = express();

// Middleware
app.use(express.json());

if (process.env.NODE_ENV == "development") {
    app.use(morgan("dev"));
    console.log(`Mode : ${process.env.NODE_ENV}`);
}

// Route
app.use("/api/v1/categories", categoryRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`app running on Port ${PORT}`);
});
