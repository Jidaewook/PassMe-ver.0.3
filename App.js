const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();

const app = express();

const port = 3000;

const userRoutes = require('./Routes/user');
const profileRoutes = require('./Routes/profile');
const bbsRoutes = require('./Routes/bbs');


require('./db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use('/user', userRoutes);
app.use('/profile', profileRoutes);
app.use('/bbs', bbsRoutes);

app.listen(port, () => console.log(`Server Running on ${port}`));