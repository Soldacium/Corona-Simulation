import { Human } from './human.model';

export interface Human3d extends Human {
    quarantine: boolean;
    position: {
        x: number,
        y: number,
        z: number
    };
    meshId: number;
}
