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
app.use("/api/users", require("./routers/userRoute"));
app.use("/api/posts", require("./routers/postsRoute"));
app.use("/api/comments", require("./routers/commentRoute"));
app.use("/api/categories", require("./routers/categoryRoute"));
// running server
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
