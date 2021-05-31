import { EventEmitter, Injectable } from '@angular/core';
import { LineChartData } from '@shared/models/chart-data-line';
import { PieChartData } from '@shared/models/chart-data-pie';
import { Human } from '@shared/models/human.model';
import { SimulationOptions } from '@shared/models/simulation-options.model';
import { Simulation2d } from '@shared/models/simulation-2d';
import { DailyStatistics } from '@shared/models/statistics-day';
import { SimulationsSavedService } from '@shared/services/simulations-saved.service';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  LineChartDataEmmiter = new EventEmitter<LineChartData[]>();

  simulationId = '';
  simulationName = '';

  private population: Human[] = [];
  pauseSimulation = true;
  simulationDays = 0;

  private options: SimulationOptions = {
    name: '',
    populationSize: 1000,
    startingInfected: 5,
    infectionRate: 0.2,
    mortalityRate: 0.2,
    timeToRecover: 10,
    timeToDeath: 9,
    maxSimulationDays: 40,
    simulationSlowdown: 100
  };

  private dailyStats: DailyStatistics[] = [
    {
      healthy: 0,
      infected: 0,
      dead: 0,
      immune: 0
    }
  ];

  private chartData: LineChartData[] = [
    {
      name: 'Healthy',
      series: []
    },
    {
      name: 'Infected',
      series: []
    },
    {
      name: 'Dead',
      series: []
    },
    {
      name: 'Immune',
      series: []
    },
  ];

  constructor(private savedSimulations: SimulationsSavedService) { }

  getOptions(): SimulationOptions {
    return this.options;
  }

  getChartData(): LineChartData[]{
    return [...this.chartData];
  }

  getPieChartData(dayNumber: number): PieChartData[] {
    const pieChartData: any[] = [];
    const dayStats = this.dailyStats[dayNumber];

    Object.entries(dayStats).forEach(
      ([key, value]) => {
        pieChartData.push({
          name: key,
          value
        });
      }
    );
    return pieChartData;
  }

  newSimulation(): void{
    this.pauseSimulation = true;
    this.dailyStats = [];
    this.population = [];
    this.simulationDays = 0;
    for (let i = 0; i < this.options.populationSize; i++){
      this.population.push({
        isImmune: false,
        isInfected: false,
        isAlive: true,
        timeInfected: 0
      });
    }

    for (let i = 0; i < this.options.startingInfected; i++){
      this.population[i].isInfected = true;
    }

    const day1 = {
        healthy: this.options.populationSize - this.options.startingInfected,
        infected: this.options.startingInfected,
        dead: 0,
        immune: 0
    };

    this.resetChartData();
    this.dailyStats.push(day1);
    this.pushDayToChartData(day1, 0);
  }

  private resetChartData(): void{
    this.chartData[0].series = [];
    this.chartData[1].series = [];
    this.chartData[2].series = [];
    this.chartData[3].series = [];
    this.LineChartDataEmmiter.emit([...this.chartData]);
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
    this.pushDayToChartData(today, this.simulationDays);
  }

  private pushDayToChartData(day: DailyStatistics, dayNumber: number): void{
    this.chartData[0].series.push({
      name: dayNumber.toString(),
      value: day.healthy
    });
    this.chartData[1].series.push({
      name: dayNumber.toString(),
      value: day.infected
    });
    this.chartData[2].series.push({
      name: dayNumber.toString(),
      value: day.dead
    });
    this.chartData[3].series.push({
      name: dayNumber.toString(),
      value: day.immune
    });

    this.LineChartDataEmmiter.emit([...this.chartData]);
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
  setActiveSimulation(simulation: Simulation2d): void{
    this.resetChartData();
    simulation.data.forEach((el) => {
      el.dead = parseInt(el.dead.toString(), 10);
      el.immune = parseInt(el.immune.toString(), 10);
      el.infected = parseInt(el.infected.toString(), 10);
      el.healthy = parseInt(el.healthy.toString(), 10);
    });
    this.dailyStats = simulation.data;
    this.options = simulation.options;
    this.simulationId = simulation._id;

    this.dailyStats.forEach((day, i) => {
      this.pushDayToChartData(day, i);
    });
  }

  wait(ms: number): Promise < any > {
    return new Promise(res => setTimeout(res, ms));
  }
}




