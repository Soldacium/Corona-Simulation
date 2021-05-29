import { Component, OnInit } from '@angular/core';
import { SimulationEngineService } from './simulation-engine.service';

@Component({
  selector: 'app-simulation-display',
  templateUrl: './simulation-display.component.html',
  styleUrls: ['./simulation-display.component.scss']
})
export class SimulationDisplayComponent implements OnInit {

  canvas!: HTMLCanvasElement;

  constructor(private simulationEngine: SimulationEngineService) { }

  ngOnInit(): void {
    this.initAnimation();
  }

  initAnimation(): void{
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.simulationEngine.init(this.canvas);
  }

}
