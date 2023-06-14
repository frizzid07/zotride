const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();

const User = mongoose.model("User");

router.patch("/editProfile", async(req,res)=>{
    console.log("Hello")
    try{
    console.log("Received Edit Profile Request")
    const id = req.query.id;
    const { data } = req.body;

    const existingUser = await User.findById(id);

    existingUser.firstName = data.firstName
    existingUser.lastName = data.lastName
    existingUser.monthofBirth = data.monthofBirth
    existingUser.dayOfBirth = data.dayOfBirth
    existingUser.yearOfBirth = data.yearOfBirth

    const updatedUser = await existingUser.save();

    res.status(200).json({newData:updatedUser})
    }
    catch(error){
        console.log(error);
        res.status(500).json({error: 'Some error'})
    }
    
});

module.exports = router;