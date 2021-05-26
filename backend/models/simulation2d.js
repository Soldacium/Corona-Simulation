const mongoose = require('mongoose');

const albumSchema = mongoose.Schema({
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
    name: String,
    description: String,
    pictures: [String],
});

module.exports = mongoose.model('Album', albumSchema);