import { Component, OnInit } from '@angular/core';
import { SimulationService } from '@simulation3d/simulation.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {

  constructor(private simulationService: SimulationService) { }

  ngOnInit(): void {
  }

  startSimulation(){
    this.simulationService.newSimulation();
  }

}
