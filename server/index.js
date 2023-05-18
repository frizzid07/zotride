const express = require("express");
const app = express();

require("./database");
require("./models/User");
require("./models/Driver");
require("./models/Ride");
require("dotenv").config();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const authRoutes = require("./routes/authRoutes");
app.use(authRoutes);
// const requireToken = require("./middleware/authTokenRequired");

const driverRegistration = require("./routes/driverRegistration");
app.use(driverRegistration);

const listRide = require("./routes/listRide");
app.use(listRide);

app.get("/", (req, res) => {
  res.send(res.body);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
