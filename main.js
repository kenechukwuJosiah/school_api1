const mongoose = require('mongoose');
const postutmeroute = require('./route/routeControl');
const express = require('express');
const cors = require('cors');
// const postutmeControler = require('')

mongoose
  .connect(
    // 'mongodb+srv://postutme:pWFC9k9Fc1gKsnbG@cluster0.aoro7.mongodb.net/postutme?authSource=admin',
    'mongodb://localhost:27017/postutme',
    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log('DB connection successful');
  })
  .catch(() => console.log('ERROR'));

const app = express();

app.use(express.json());
app.use(cors());

app.use('/postutme', postutmeroute);

app.listen(3000, () => {
  console.log('App running on port 3000');
});
