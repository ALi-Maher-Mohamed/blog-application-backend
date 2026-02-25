const express = require("express");
const app = express();
require("dotenv").config();
const connetToDb = require("./config/connectToDb");

const PORT = process.env.PORT || 8000;
// connect to db
connetToDb();
// Middleware
app.use(express.json());
// Routes
app.use("/api/auth", require("./routers/authRoute"));
// running server
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
