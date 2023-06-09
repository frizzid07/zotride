const express = require("express");
const app = express();

require("./database");
require("./models/User");
require("./models/Driver");
require("./models/Ride");
require("dotenv").config();
require("./models/Ride");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const authRoutes = require("./routes/authRoutes");
app.use(authRoutes);
const listRide = require("./routes/listRide");
app.use(listRide);
const findRide = require("./routes/findRide");
app.use(findRide);
const bookRide = require("./routes/bookRide");
app.use(bookRide);
// const requireToken = require("./middleware/authTokenRequired");

const editRoutes = require("./routes/editRoutes");
app.use(editRoutes);

const editProfileRoute = require("./routes/editProfileRoute");
app.use(editProfileRoute);

const deleteRoutes = require("./routes/deleteRoutes");
app.use(deleteRoutes);

const driverRegistration = require("./routes/driverRegistration");
app.use(driverRegistration);

// const paypal = require("./middleware/paypal");
// app.use(paypal);

app.get("/", (req, res) => {
  res.send(res.body);
});

app.get('/paypal/success', (req, res) => {
  // Retrieve the screen name or identifier from your server logic
  res.redirect('../src/screens/SuccessPayment');
});

app.get('/paypal/cancel', (req, res) => {
  // Retrieve the screen name or identifier from your server logic
  res.redirect('../src/screens/CancelPayment');
});


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
