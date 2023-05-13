const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
    licenseNumber: {type: String},
    userId: {type: String},
    vehicleInformation: [{number:{type: String,required:true},model:{type: String,required:true},capacity:{type: Number,required:true}}]
}, {timestamps: true});

mongoose.model("Driver", driverSchema)