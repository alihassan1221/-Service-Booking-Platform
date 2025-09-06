const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/bookings', require('./src/routes/bookings'));
app.use('/api/users', require('./src/routes/users'));

app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;