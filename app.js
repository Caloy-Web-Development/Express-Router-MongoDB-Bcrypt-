require('dotenv').config()
const express = require('express')
const app = express()

const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());

const accountRouter = require('./routes/accounts');

app.use('/users',accountRouter);

const PORT = 3000;

app.listen(PORT, () => console.log('Listening to port ' + PORT ));