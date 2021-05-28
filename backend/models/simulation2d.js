const mongoose = require('mongoose');

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
    data: [{
        infected: String,
        healthy: String,
        immune: String,
        dead: String
    }],
    name: String,
});

module.exports = mongoose.model('Simulation2d', simulation2dSchema);