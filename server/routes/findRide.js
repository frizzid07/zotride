const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Ride = mongoose.model('Ride');

router.post('/findRide', async (req, res) => {
    const { startLocation, endLocation, startTime } = req.body;

    const time = new Date(startTime)
    const beginTime = new Date(time.getTime() - 30 * 60000);
    const endTime = new Date(time.getTime() + 30 * 60000);
    const condition = {startLocation:startLocation,endLocation:endLocation,startTime:{ $gte: beginTime, $lte: endTime }};
    const result = await Ride.find(condition).exec();

    return res.status(200).send(result);

});

module.exports = router;