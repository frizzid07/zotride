const express = require('express');
const app = express();

require('./database');
require('./models/User');
require('dotenv').config();
require('./models/Ride');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const authRoutes = require('./routes/authRoutes');
app.use(authRoutes);
const listRide = require('./routes/listRide');
app.use(listRide)
const requireToken = require('./middleware/authTokenRequired');

app.get('/', (req, res) => {
    res.send(res.body);
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})