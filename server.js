const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* --------------------------- Connect to MongoDB --------------------------- */
const db_connection = async () => {
  await mongoose
    .connect(process.env.atlas_URL)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
};
db_connection();
/* ------------------------ Error Handling  ----------------------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ error: message });
});

/* ------------------------ 404 Not Found  ------------------------ */
app.use((req, res) => {
  res.status(404).json({ error: "Route Not Found" });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "127.0.0.1";
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
