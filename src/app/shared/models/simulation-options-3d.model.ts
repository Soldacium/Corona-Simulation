import { SimulationOptions } from './simulation-options.model';

export interface SimulationOptions3d extends SimulationOptions {
    populationSpread: number;
    infectionSpreadDistance: number;
}
