const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();

const Ride = mongoose.model("Ride");
const Driver = mongoose.model("Driver");

router.patch("/editDriver", async (req, res) => {
    try {
        const id = req.query.driverId;
        const { editData } = req.body;

        const existingDriver = await Driver.findOne({userId: id});

        if (!existingDriver) {
            // Resource with the given ID not found
            return res.status(404).json({ error: 'Resource not found' });
        }

        // Update the existing driver document with the updateData
        if(editData.hasOwnProperty("licenseNumber"))
            existingDriver.licenseNumber = editData.licenseNumber
        if(editData.vehicleInformation && editData.vehicleInformation[0]) {
            const vehicleInfo = editData.vehicleInformation[0];
            if (vehicleInfo.hasOwnProperty("vehicleNumber")) {
                existingDriver.vehicleInformation[0].vehicleNumber = vehicleInfo.vehicleNumber;
            }
            if (vehicleInfo.hasOwnProperty("vehicleModel")) {
                existingDriver.vehicleInformation[0].vehicleModel = vehicleInfo.vehicleModel;
            }
            if (vehicleInfo.hasOwnProperty("vehicleCapacity")) {
                existingDriver.vehicleInformation[0].vehicleCapacity = vehicleInfo.vehicleCapacity;
            }
            if (vehicleInfo.hasOwnProperty("vehicleColor")) {
                existingDriver.vehicleInformation[0].vehicleColor = vehicleInfo.vehicleColor;
            }
            if (vehicleInfo.hasOwnProperty("vehicleCompany")) {
                existingDriver.vehicleInformation[0].vehicleCompany = vehicleInfo.vehicleCompany;
            }
        }

        const updatedDriver = await existingDriver.save();

        // Resource updated successfully
        res.status(200).json({ message: 'Resource updated successfully', newData: updatedDriver });
    } catch (error) {
    // Error occurred during the update
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;