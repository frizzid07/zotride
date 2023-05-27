const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Driver = mongoose.model("Driver");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/checkDriverReg", async (req, res) => {
  const { userId } = req.body.data;
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
  const { licenseNumber, userId, vehicleInformation } = req.body.data;
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
  const { userId } = req.body.data;
  console.log(`User ID inside ${userId}`);
  try {
    const updatedUser = await User.findOne({ _id: userId });
    console.log(updatedUser);
    if(updatedUser) {
      updatedUser.isDriver = !updatedUser.isDriver;
      await updatedUser.save();
      console.log("User registration updated successfully");
      return res.status(200).send({ updatedUser });
    } else {
      return res.status(404).send({ error: "User not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Failed to update user" });
  }
});

router.get("/getDriver", async (req, res) => {
  const id = req.query.driverId;
  try {
    const user = await User.findById(id).lean().exec();
    console.log(user);
    const driver = await Driver.findOne({ userId: id });
    console.log(driver);
    res.status(200).send({ user, driver });
  } catch (error) {
    return res.status(500).send({ error: error.message });
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
