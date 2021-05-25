import { Component, OnInit } from '@angular/core';
import { SimulationOptions } from '@shared/models/simulationOptions.model';
import { SimulationService } from '@simulation2d/simulation.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {

  population = 100;

  simulationSpeed = 30;
  pauseSimulation = true;
  simulationLocked = false;
  asyncChanges = true;

  options: SimulationOptions = {
    name: '',
    populationSize: 100,
    startingInfected: 10,
    infectionRate: 0.7,
    mortalityRate: 0.3,
    timeToRecover: 20,
    timeToDeath: 10,
    maxSimulationDays: 100
  };

  constructor(private simulationService: SimulationService) { }

  start(): void{
    this.simulationLocked = true;
    this.pauseSimulation = false;
  }

  reset(): void{
    this.simulationLocked = false;
    this.pauseSimulation = true;
  }

  save(): void{

  }

  pause(): void{
    this.pauseSimulation = true;
  }

  resume(): void{
    this.pauseSimulation = false;
  }

  ngOnInit(): void {
  }

}
