import { EventEmitter, Injectable } from '@angular/core';
import { Human3d } from '@shared/models/human3d.model';
import { Simulation2d } from '@shared/models/simulation-2d';
import { DailyStatistics } from '@shared/models/statistics-day';
import { SimulationsSavedService } from '@shared/services/simulations-saved.service';
import { SimulationOptions3d } from '@shared/models/simulation-options-3d.model';
import { SimulationEngineService } from './simulation-display/simulation-engine.service';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  simulationId = '';
  simulationName = '';

  private population: Human3d[] = [];
  pauseSimulation = true;
  simulationDays = 0;

  private options: SimulationOptions3d = {
    name: '',
    populationSize: 1000,
    startingInfected: 5,
    infectionRate: 0.2,
    mortalityRate: 0.2,
    timeToRecover: 10,
    timeToDeath: 9,
    maxSimulationDays: 40,
    simulationSlowdown: 100,
    populationSpread: 5000,
    infectionSpreadDistance: 50,
  };

  private dailyStats: DailyStatistics[] = [
    {
      healthy: 0,
      infected: 0,
      dead: 0,
      immune: 0
    }
  ];

  constructor(
      private savedSimulations: SimulationsSavedService,
      private simulationEngine: SimulationEngineService) { }

  getOptions(): SimulationOptions3d {
    return this.options;
  }

  newSimulation(): void{
    this.pauseSimulation = true;
    this.dailyStats = [];
    this.population = [];
    this.simulationDays = 0;
    for (let i = 0; i < this.options.populationSize; i++){
      const x = Math.random() * this.options.populationSpread - this.options.populationSpread / 2;
      const y = Math.random() * this.options.populationSpread - this.options.populationSpread / 2;
      const z = Math.random() * this.options.populationSpread - this.options.populationSpread / 2;
      this.population.push({
        isImmune: false,
        isInfected: false,
        isAlive: true,
        timeInfected: 0,
        quarantine: false,
        position: {
            x,
            y,
            z,
        },
        meshId: this.simulationEngine.makeNewHumanMesh(x,y,z)
      });
    }

    for (let i = 0; i < this.options.startingInfected; i++){
      this.population[i].isInfected = true;
    }

    console.log(this.population)

    const day1 = {
        healthy: this.options.populationSize - this.options.startingInfected,
        infected: this.options.startingInfected,
        dead: 0,
        immune: 0
    };
    this.dailyStats.push(day1);
  }

  async startSimulation(): Promise<void>{
    this.pauseSimulation = false;
    while (!this.pauseSimulation && this.simulationDays < this.options.maxSimulationDays){
      await this.wait(this.options.simulationSlowdown).then(res => {
        this.nextDay();
      });
    }
  }

  private nextDay(): void{
    const previousDay = this.dailyStats[this.dailyStats.length - 1];
    const today = {...this.dailyStats[this.dailyStats.length - 1]};
    let toBeInfected = 0;
    for (let i = 0; i < previousDay.infected; i++){
      let minimum = Math.floor(this.options.infectionRate);
      if (Math.random() < this.options.infectionRate - minimum){
        minimum += 1;
      }
      toBeInfected += minimum;
    }

    this.population.forEach(human => {
      if (!human.isAlive || human.isImmune){
        return;
      }

      if (human.isInfected && human.timeInfected >= this.options.timeToDeath && Math.random() < this.options.mortalityRate){
        human.isAlive = false;
        today.dead += 1;
        today.infected -= 1;
        return;
      }

      if (human.isInfected && human.timeInfected >= this.options.timeToRecover){
        human.isImmune = true;
        today.immune += 1;
        today.infected -= 1;
      }

      if (!human.isImmune && !human.isInfected && toBeInfected > 0){
        human.isInfected = true;
        today.healthy -= 1;
        today.infected += 1;
        toBeInfected -= 1;
      }

      if (human.isInfected){
        human.timeInfected += 1;
      }
    });
    this.simulationDays += 1;
    this.dailyStats.push(today);
  }

  saveSimulation(): void{
    const databaseObjectIdLength = 24;
    if (this.simulationId.length !== databaseObjectIdLength){
      this.savedSimulations.postSimulation2d(this.makeSimulationObject()).subscribe((simulation: Simulation2d) => {
        this.simulationId = simulation._id;
      });
    }else{
      this.savedSimulations.updateSimulation2d(this.makeSimulationObject()).subscribe();
    }
  }

  private makeSimulationObject(): Simulation2d{
    return {
      data: this.dailyStats,
      options: this.options,
      _id: this.simulationId
    };
  }

  // can be optimised
  /*
  setActiveSimulation(simulation: Simulation2d): void{
    simulation.data.forEach((el) => {
      el.dead = parseInt(el.dead.toString(), 10);
      el.immune = parseInt(el.immune.toString(), 10);
      el.infected = parseInt(el.infected.toString(), 10);
      el.healthy = parseInt(el.healthy.toString(), 10);
    });
    this.dailyStats = simulation.data;
    this.options = simulation.options;
    this.simulationId = simulation._id;
  }
  */

  wait(ms: number): Promise < any > {
    return new Promise(res => setTimeout(res, ms));
  }
}

