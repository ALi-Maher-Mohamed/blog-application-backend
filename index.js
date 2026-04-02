const express = require("express");
const app = express();
const cors = require("cors");
const xss = require("xss-clean");
const hpp = require("hpp");
const helmet = require("helmet");
const rateLimiting = require("express-rate-limit");
require("dotenv").config();
const connetToDb = require("./config/connectToDb");
const { errorHandler, notFound } = require("./Middlewares/error");
const PORT = process.env.PORT || 8000;
// connect to db
connetToDb();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_DOMAIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
// Routes
app.get("/", (req, res) => {
  res.send("API is running successfully!");
});
app.use("/api/auth", require("./routers/authRoute"));
app.use("/api/users", require("./routers/userRoute"));
app.use("/api/posts", require("./routers/postsRoute"));
app.use("/api/comments", require("./routers/commentRoute"));
app.use("/api/categories", require("./routers/categoryRoute"));
app.use("/api/password", require("./routers/passwordRoute"));

app.use(notFound);
// error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
});
