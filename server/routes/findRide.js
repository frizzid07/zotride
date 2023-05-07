const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Ride = mongoose.model('Ride');

router.post('/findRide', (req, res) => {
    const { startLocation, endLocation, startTime } = req.body;

    const condition = {startLocation:startLocation,endLocation:endLocation};
    const result = Ride.find(condition);
    console.log(result)

});