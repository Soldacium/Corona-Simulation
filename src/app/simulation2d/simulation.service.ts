import { EventEmitter, Injectable } from '@angular/core';
import { LineChartData } from '@shared/models/chart-data-line';
import { PieChartData } from '@shared/models/chart-data-pie';
import { Human } from '@shared/models/human.model';
import { SimulationOptions } from '@shared/models/simulation-options.model';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  LineChartDataEmmiter = new EventEmitter<LineChartData[]>();

  population: Human[] = [];
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
    simulationSlowdown: 1000
  };

  dailyStats: DailyStatistics[] = [
    {
      healthy: 0,
      sick: 0,
      dead: 0,
      immune: 0
    }
  ];

  chartData: LineChartData[] = [
    {
      name: 'Healthy',
      series: []
    },
    {
      name: 'Sick',
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

  constructor() { }

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
        sick: this.options.startingInfected,
        dead: 0,
        immune: 0
    };

    this.resetChartData();
    this.dailyStats.push(day1);
    this.pushDayToChartData(day1);
  }

  async startSimulation(): Promise<void>{
    this.pauseSimulation = false;
    while (!this.pauseSimulation && this.simulationDays < this.options.maxSimulationDays){
      await this.wait(this.options.simulationSlowdown).then(res => {
        this.nextDay();
      });
    }
  }

  nextDay(): void{
    const previousDay = this.dailyStats[this.dailyStats.length - 1];
    const today = {...this.dailyStats[this.dailyStats.length - 1]};
    let toBeInfected = 0;
    for (let i = 0; i < previousDay.sick; i++){
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
        today.sick -= 1;
        return;
      }

      if (human.isInfected && human.timeInfected >= this.options.timeToRecover){
        human.isImmune = true;
        today.immune += 1;
        today.sick -= 1;
      }

      if (!human.isImmune && !human.isInfected && toBeInfected > 0){
        human.isInfected = true;
        today.healthy -= 1;
        today.sick += 1;
        toBeInfected -= 1;
      }

      if (human.isInfected){
        human.timeInfected += 1;
      }
    });
    this.simulationDays += 1;
    this.dailyStats.push(today);
    this.pushDayToChartData(today);
    console.log(this.dailyStats);
  }

  pushDayToChartData(day: DailyStatistics): void{
    const outbreakDay = this.dailyStats.length - 1;
    this.chartData[0].series.push({
      name: outbreakDay.toString(),
      value: day.healthy
    });
    this.chartData[1].series.push({
      name: outbreakDay.toString(),
      value: day.sick
    });
    this.chartData[2].series.push({
      name: outbreakDay.toString(),
      value: day.dead
    });
    this.chartData[3].series.push({
      name: outbreakDay.toString(),
      value: day.immune
    });

    this.LineChartDataEmmiter.emit([...this.chartData]);
  }

  resetChartData(): void{
    this.chartData[0].series = [];
    this.chartData[1].series = [];
    this.chartData[2].series = [];
    this.chartData[3].series = [];

    this.LineChartDataEmmiter.emit([...this.chartData]);
  }

  wait(ms: number): Promise < any > {
    return new Promise(res => setTimeout(res, ms));
  }
}

export interface DailyStatistics {
  healthy: number;
  sick: number;
  dead: number;
  immune: number;
}


