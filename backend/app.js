const express = require('express')
const simulations2dRoutes = require('./routes/simulations2d');
const mongoose = require('mongoose');
const keys = require('./keys');
const path = require('path');
const bodyParser = require('body-parser');


const app = express();

mongoose.connect(`mongodb+srv://${keys.keys.login}:${keys.keys.password}@testingcluster.rgayz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, { useNewUrlParser: true , useUnifiedTopology: true})
    .then(() => {
        console.log('connected to DB')
    })
    .catch(() =>{
        console.log('cannot connect to DB :/')
    });

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: false}));

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      'Access-Control-Allow-Credentials', 'true'
    )
    next();
})

// app.use("/images", express.static(path.join('backend/images')));
app.use('/api/simulations2d/',simulations2dRoutes);

module.exports = app;