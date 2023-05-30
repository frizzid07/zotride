const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();

const Ride = mongoose.model("Ride");
const Driver = mongoose.model("Driver");

router.delete("/deleteRide", async (req, res) => {
  const id = req.query.rideId;
  console.log(`Ride to be cancelled: ${id}`);
  await Ride.deleteOne({ _id: id })
    .then(() => {
      console.log("Cancelled the Ride");
      res.status(200).send({ deleted: true });
    })
    .catch((err) => {
      console.log("Could not cancel the Ride " + err);
      res.status(422).send({ deleted: false, error: err });
    });
});

router.delete("/deleteDriver", async (req, res) => {
  const id = req.query.driverId;
  console.log(`Driver to be deleted: ${id}`)
  await Driver.deleteOne({ userId: id })
    .then(() => {
      console.log("Deleted Driver Info");
      res.status(200).send();
    })
    .catch((err) => {
      console.log("Could not delete Driver info");
      res.status(422).send({ error: err });
    });
});

module.exports = router;