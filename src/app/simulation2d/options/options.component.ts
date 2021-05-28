import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SimulationOptions } from '@shared/models/simulation-options.model';
import { SimulationService } from '@simulation2d/simulation.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {

  @Output()
  hideOptionsEmitter = new EventEmitter<boolean>();

  hideOptions = false;

  simulationSpeed = 30;
  pauseSimulation = true;
  simulationLocked = false;
  asyncChanges = true;

  currentDay = 0;

  options: SimulationOptions = {
    name: '',
    populationSize: 100,
    startingInfected: 10,
    infectionRate: 0.7,
    mortalityRate: 0.3,
    timeToRecover: 20,
    timeToDeath: 10,
    maxSimulationDays: 100,
    simulationSlowdown: 100
  };

  constructor(private simulationService: SimulationService) {
    this.options = this.simulationService.getOptions();
  }

  ngOnInit(): void {
    this.initOptions();
  }

  initOptions(): void{
    this.simulationService.LineChartDataEmmiter.subscribe((res: any) => {
      this.currentDay = this.simulationService.simulationDays;
    });
  }

  changeOptionsVisibility(): void{
    this.hideOptions = !this.hideOptions;
    this.hideOptionsEmitter.emit(this.hideOptions);
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
