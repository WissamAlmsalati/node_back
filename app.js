const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');



const app = express();
app.use(express.json());

const userRouter = require('./Routers/UserRouter');
// const productRouter = require('./Routers/ProductRouter');


app.use('/users', userRouter);
// app.use('/products', productRouter);

const PORT = process.env.PORT || 3000;


module.exports = app;