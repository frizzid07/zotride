const express = require('express');
const app = express();

require('./database');
require('./models/User');

// import Welcome from '../src/screens/Welcome';
// import Login from '../src/screens/Login';
// import Register from '../src/screens/Register';
// import Verify from '../src/screens/Verify';
// import Landing from '../src/screens/Landing';

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const authRoutes = require('./routes/authRoutes');
app.use(authRoutes);
const requireToken = require('./middleware/authTokenRequired');

app.get('/', (req, res) => {
    res.send(res.body);
})

app.get('/login', (req, res) => {
    res.send(res.body);
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})