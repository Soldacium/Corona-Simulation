const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
    infected: String,
    healthy: String,
    immune: String,
    dead: String,
}, { _id : false });

const simulation2dSchema = mongoose.Schema({
    options: {
        name: String,
        populationSize: Number,
        startingInfected: Number,
        infectionRate: Number,
        mortalityRate: Number,
        timeToRecover: Number,
        timeToDeath: Number,
        maxSimulationDays: Number,
        simulationSlowdown: Number
    },
    data: [dataSchema],
    name: String,
});

module.exports = mongoose.model('Simulation2d', simulation2dSchema);