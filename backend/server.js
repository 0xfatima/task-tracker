require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const taskRoutes = require("./routes/taskRoutes")


const app = express();

//middleware to handle cors

app.use(
    cors({
        origin: process.env.CLIENT_URL || '*',
        method:["GET", "POST", "PUT", "DELETE"],
        allowedHeaders:["Content-Type", "Authorization"],
    })
)

//connect datbase
connectDB()

//middleware
app.use(express.json())

//Routes

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

//server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Start server

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`server running on port ${PORT}`))