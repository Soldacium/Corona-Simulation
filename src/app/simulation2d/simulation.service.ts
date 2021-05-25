import { Injectable } from '@angular/core';
import { Human } from '@shared/models/human.model';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  population: Human[] = []

  constructor() { }

  newSimulation(){

  }

  changeOptions(){
    
  }
}
