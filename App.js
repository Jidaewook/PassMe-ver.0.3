

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

//익스프레스 안에 내장된 경로 라이브러리
const path = require('path');

dotenv.config();

const app = express();


const userRoutes = require('./Routes/user');
const profileRoutes = require('./Routes/profile');
const bbsRoutes = require('./Routes/bbs');



require('./db');

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.use('/user', userRoutes);
app.use('/profile', profileRoutes);
app.use('/bbs', bbsRoutes);

const port = process.env.PORT || 7000;

app.listen(port, () => console.log(`Server Running on ${port}`));