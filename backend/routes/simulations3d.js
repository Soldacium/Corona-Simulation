const express = require('express');
const router = express.Router();
const Simulation3d = require('../models/simulation3d');


router.post('', (req, res, next) => {
    const simulation = new Simulation2d({
        options: req.body.options,
        name: req.body.name,
        data: req.body.data
    });
    simulation
    .save()
    .then(
        createdSimulation => res.status(200).json(createdSimulation),
        err => {res.status(500).json(err); console.error(err)}
    )
})

router.get('',(req,res,next) => {
    Simulation3d
    .find()
    .then(
        simulations => res.status(200).json(simulations),
        err => {res.status(500).json(err); console.error(err)}
    );
});

router.get('/:id',(req,res,next) => {
    Simulation3d
    .findOne({_id: req.params.id})
    .then(
        simulation => res.status(200).json(simulation),
        err => {res.status(500).json(err); console.error(err)}
    );
});

router.delete('/:id',(req,res,next) => { 
    Simulation3d
    .deleteOne({_id: req.params.id})
    .then(
        deleteResult => res.status(200).json(deleteResult),
        err => {res.status(500).json(err); console.error(err)}
    );
});


router.patch('/:id', (req,res,next) => {
    Simulation3d
    .updateOne({_id: req.params.id},req.body)
    .then(
        updateResult => res.status(200).json(updateResult),
        err => {res.status(500).json(err); console.error(err)}
    )
})

module.exports = router;