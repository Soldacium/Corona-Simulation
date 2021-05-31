import { EventEmitter, Injectable } from '@angular/core';
import { Human3d } from '@shared/models/human-3d.model';
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
    populationSize: 500,
    startingInfected: 3,
    infectionRate: 0.01,
    mortalityRate: 0.2,
    timeToRecover: 15,
    timeToDeath: 9,
    maxSimulationDays: 180,
    simulationSlowdown: 1000,
    populationSpread: 2000,
    infectionSpreadDistance: 400,
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
    this.simulationEngine.reset();
    this.simulationDays = 0;

    this.makePopulation();
    this.makePopulationConnections();
    this.makePopulationInfected();

    const day1 = {
        healthy: this.options.populationSize - this.options.startingInfected,
        infected: this.options.startingInfected,
        dead: 0,
        immune: 0
    };
    this.dailyStats.push(day1);
  }

  private makePopulation(): void{
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
        spreads: [],
        meshId: this.simulationEngine.makeNewHumanMesh(x, y, z),
        id: i,
        nearbyHumansIds: []
      });
    }
  }

  private makePopulationConnections(): void{
    this.population.forEach(human => {
      this.population.forEach(anotherHuman => {
        if (anotherHuman === human){
          return;
        }
        const distance = Math.sqrt(
          Math.pow(human.position.x - anotherHuman.position.x, 2) +
          Math.pow(human.position.y - anotherHuman.position.y, 2) +
          Math.pow(human.position.z - anotherHuman.position.z, 2));
        if (distance < this.options.infectionSpreadDistance && !anotherHuman.nearbyHumansIds.includes(human.id)){
          human.nearbyHumansIds.push(anotherHuman.id);
          anotherHuman.nearbyHumansIds.push(human.id);
        }
      });
    });
  }

  private makePopulationInfected(): void{
    for (let i = 0; i < this.options.startingInfected; i++){
      this.population[i].isInfected = true;
      // this.simulationEngine.changeMeshColor(this.population[0].meshId,this.simulationEngine.colors.infected);
    }
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
    const today = {...this.dailyStats[this.dailyStats.length - 1]};

    this.population.forEach(human => {
      if (!human.isAlive || human.isImmune){
        return;
      }

      if (human.isInfected && human.timeInfected >= this.options.timeToDeath && Math.random() < this.options.mortalityRate){
        human.isAlive = false;
        today.dead += 1;
        today.infected -= 1;
        this.simulationEngine.changeMeshColor(human.meshId, this.simulationEngine.colors.dead);
        human.spreads.forEach(spread => {
          this.simulationEngine.hideLine(spread.lineId);
        });
        return;
      }

      if (human.isInfected && human.timeInfected >= this.options.timeToRecover){
        human.isImmune = true;
        today.immune += 1;
        today.infected -= 1;
        this.simulationEngine.changeMeshColor(human.meshId, this.simulationEngine.colors.immune);
        human.spreads.forEach(spread => {
          this.simulationEngine.hideLine(spread.lineId);
        });
      }

      if (human.isInfected){
        human.timeInfected += 1;
        human.nearbyHumansIds.forEach(nearbyHumanId => {
          const nearbyHuman = this.population[nearbyHumanId];
          if (Math.random() < this.options.infectionRate && !nearbyHuman.isInfected){
            const lineId = this.simulationEngine.drawLineBetweenMeshes(human.meshId, nearbyHuman.meshId);
            human.spreads.push({lineId, humanId: nearbyHuman.id});
            today.infected += 1;
            nearbyHuman.isInfected = true;
          }
        });
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

