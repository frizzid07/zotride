const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();

const Ride = mongoose.model("Ride");

router.post("/deleteRide", async (req, res) => {
  const { id } = req.body.data;
  Ride.deleteOne({ _id: id })
    .then(() => {
      console.log("Deleted the Ride");
      res.status(200).send({ deleted: true });
    })
    .catch((err) => {
      console.log("Could not delete the Ride " + err);
      res.status(200).send({ deleted: false });
    });
});

module.exports = router;
