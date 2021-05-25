export interface SimulationOptions {
    name: string;
    populationSize: number;
    startingInfected: number;
    infectionRate: number;
    mortalityRate: number;
    timeToRecover: number;
    timeToDeath: number;
    maxSimulationDays: number;
}