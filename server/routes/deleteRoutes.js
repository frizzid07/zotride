const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();

const Ride = mongoose.model("Ride");
const Driver = mongoose.model("Driver");

router.post("/deleteRide", async (req, res) => {
  const { id } = req.body.data;
  await Ride.deleteOne({ _id: id })
    .then(() => {
      console.log("Deleted the Ride");
      res.status(200).send({ deleted: true });
    })
    .catch((err) => {
      console.log("Could not delete the Ride " + err);
      res.status(422).send({ deleted: false });
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