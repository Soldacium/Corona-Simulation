import { SimulationOptions } from './simulation-options.model';
import { DailyStatistics } from './statistics-day';

export interface Simulation2d {
    name: string;
    options: SimulationOptions;
    data: DailyStatistics[];
    _id: string;
}
