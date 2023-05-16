const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Driver = mongoose.model("Driver");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/driverRegistration", async (req, res) => {
  const { licenseNumber, userId, vehicleInformation } = req.body;
  const driver = new Driver({
    licenseNumber,
    userId,
    vehicleInformation,
  });

  if (validateInput(licenseNumber, userId, vehicleInformation) == 0) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    await driver.save();
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }

  console.log("success");
  return res.status(200).send();
});

function validateInput(licenseNumber, userId, vehicleInformation) {
  if (!licenseNumber || !userId || !vehicleInformation) {
    return 0;
  }

  for (let i = 0; i < vehicleInformation.length; i++) {
    if (
      !vehicleInformation[i].vehicleNumber ||
      !vehicleInformation[i].vehicleCapacity ||
      !vehicleInformation[i].vehicleModel ||
      !vehicleInformation[i].vehicleColor ||
      !vehicleInformation[i].vehicleCompany
    ) {
      return 0;
    }
  }

  return 1;
}

module.exports = router;
