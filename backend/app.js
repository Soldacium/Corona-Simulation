const express = require('express')
const albumRoutes = require('./routes/albums');
const pictureRoutes = require('./routes/pictures');
const mongoose = require('mongoose');
const keys = require('./keys');
const path = require('path');


const app = express();

mongoose.connect(`mongodb+srv://${keys.mongoUser.login}:${keys.mongoUser.password}@testingcluster.rgayz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, { useNewUrlParser: true , useUnifiedTopology: true})
    .then(() => {
        console.log('connected to DB')
    })
    .catch(() =>{
        console.log('cannot connect to DB :/')
    });

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

app.use("/images", express.static(path.join('backend/images')));
app.use('/api/albums',albumRoutes);
app.use('/api/pictures',pictureRoutes);

/*
let route, routes = [];

app._router.stack.forEach(function(middleware){
    if(middleware.route){ // routes registered directly on the app
        routes.push(middleware.route);
    } else if(middleware.name === 'router'){ // router middleware 
        middleware.handle.stack.forEach(function(handler){
            route = handler.route;
            route && routes.push(route);
        });
    }
});

console.log(routes);
*/

module.exports = app;