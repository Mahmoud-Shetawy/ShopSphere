const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");

dotenv.config({path: "config.env"});

const categoryRoutes = require("./router/categoryRoute");
const subCategoryRoutes = require("./router/subCategoryRoute");
const brandRoutes = require("./router/brandRoute");
const productRoutes = require("./router/productRoute");
const userRoutes = require("./router/userRoute");
const authRoutes = require("./router/authRoute");

const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalError = require("./middleware/errorMiddleware");

//Connect to MongoDb
dbConnection();

// express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log(`Mode : ${process.env.NODE_ENV}`);
}

// Routes
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/subcategories", subCategoryRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

app.all("/{*any}", (req, res, next) => {
    next(new ApiError(`Can't find this route:  ${req.originalUrl}`, 400));
});

// Global Error Handling Middleware
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`app running on Port ${PORT}`);
});

// handled Rejection outside express
process.on("unhandledRejection", (err) => {
    console.log(`UnhandledRejection Errors :${err.name} | ${err.message} `);

    server.close(() => {
        console.log(`Server Shutting...  `);
        process.exit(1);
    });
});
