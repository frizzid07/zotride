const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Driver = mongoose.model("Driver");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/checkDriverReg", async (req, res) => {
  const { userId } = req.body;
  console.log(userId);
  try {
    const user = await Driver.findOne({ userId: userId });

    if (user) {
      console.log("Current User is a Driver");
      return res.status(200).send({ found: true });
    } else {
      console.log("Current User is not a Driver");
      return res.status(200).send({ found: false });
    }
  } catch (err) {
    console.log(err);
    return res.status(422).json({ error: err });
  }
});

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
  return res.status(200).send({ success: true });
});

router.put("/driverRegistration", async (req, res) => {
  const { licenseNumber, userId, vehicleInformation } = req.body;
  try {
    console.log(`User ID ${userId}`)
    const updatedUser = await User.findByIdAndUpdate(userId, {$set: {isDriver: true}}, {new: true, useFindAndModify: false});

    if (!updatedUser) {
      return res.status(404).send({ error: 'User not found' });
    }

    console.log('User registration updated successfully');
    return res.status(200).send();

  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: 'Failed to update user' });
  }
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
