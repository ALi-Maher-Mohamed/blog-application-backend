const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const connetToDb = require("./config/connectToDb");
const { errorHandler, notFound } = require("./Middlewares/error");
const PORT = process.env.PORT || 8000;
// connect to db
connetToDb();

// Middleware
app.use(express.json());
// cors policy
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
// Routes
app.use("/api/auth", require("./routers/authRoute"));
app.use("/api/users", require("./routers/userRoute"));
app.use("/api/posts", require("./routers/postsRoute"));
app.use("/api/comments", require("./routers/commentRoute"));
app.use("/api/categories", require("./routers/categoryRoute"));
app.use("/api/password", require("./routers/passwordRoute"));

app.use(notFound);
// error handler
app.use(errorHandler);
// running server
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
