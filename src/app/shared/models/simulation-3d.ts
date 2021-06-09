import { SimulationOptions3d } from './simulation-options-3d.model';
import { DailyStatistics } from './statistics-day';

export interface Simulation3d {
    options: SimulationOptions3d;
    data: DailyStatistics[];
    _id: string;
}