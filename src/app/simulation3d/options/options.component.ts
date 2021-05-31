import { Component, OnInit } from '@angular/core';
import { SimulationOptions3d } from '@shared/models/simulation-options-3d.model';
import { SimulationService } from '@simulation3d/simulation.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {

  constructor(private simulationService: SimulationService) {
    this.options = this.simulationService.getOptions();
  }

  hideOptions = false;

  simulationSpeed = 30;
  pauseSimulation = true;
  simulationLocked = false;
  asyncChanges = true;

  currentDay = 0;

  options: SimulationOptions3d = {
    name: '',
    populationSize: 100,
    startingInfected: 10,
    infectionRate: 0.7,
    mortalityRate: 0.3,
    timeToRecover: 20,
    timeToDeath: 10,
    maxSimulationDays: 100,
    simulationSlowdown: 100,
    populationSpread: 1000,
    infectionSpreadDistance: 500
  };



  ngOnInit(): void {
    this.initOptions();
  }

  initOptions(): void{
    window.addEventListener("keypress", (key: KeyboardEvent) => {
      if(key.code === "Space"){
        this.pauseSimulation ? this.resume() : this.pause();
      }
    })
  }

  changeOptionsVisibility(): void{
    this.hideOptions = !this.hideOptions;
    // this.hideOptionsEmitter.emit(this.hideOptions);
  }

  start(): void{
    this.simulationLocked = true;
    this.pauseSimulation = false;
    this.simulationService.newSimulation();
    this.simulationService.startSimulation();
  }

  reset(): void{
    this.simulationLocked = false;
    this.pauseSimulation = true;

    this.simulationService.newSimulation();
  }

  save(): void{
    this.simulationService.saveSimulation();
  }

  pause(): void{
    this.pauseSimulation = true;
    this.simulationService.pauseSimulation = true;
  }

  resume(): void{
    this.pauseSimulation = false;
    this.simulationService.startSimulation();
  }

  saveSimulation(): void{

  }
}
