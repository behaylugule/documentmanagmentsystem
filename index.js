const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const documentRoute = require("./routes/Document");
const folderRoute = require("./routes/folder");
const departmentRoute = require("./routes/Department");
const helmet = require("helmet")
const compression = require("compression")
const cors = require("cors");

dotenv.config();

mongoose
  .connect(process.env.MONOG_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });
app.use(helmet())
app.use(compression())
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/documents", documentRoute);
app.use("/api/folder", folderRoute);
app.use("/api/departments", departmentRoute);


app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});
