import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Simulation2d } from '@shared/models/simulation-2d';
import { SimulationsSavedService } from '@shared/services/simulations-saved.service';

@Component({
  selector: 'app-saved-simulations',
  templateUrl: './saved-simulations.component.html',
  styleUrls: ['./saved-simulations.component.scss']
})
export class SavedSimulationsComponent implements OnInit {

  expandedSimulations: number[] = [];
  simulations: Simulation2d[] = [];
  constructor(private savedSimulations: SimulationsSavedService, private router: Router) { }

  ngOnInit(): void {
    this.getSimulations();
  }

  getSimulations(): void{
    this.savedSimulations.getAllSimulations2d().subscribe((simulations: Simulation2d[]) => {
      this.simulations = simulations;
    });
  }

  loadSimulation(simulation: Simulation2d): void{
    this.savedSimulations.currentSimulation2d = simulation;
    this.router.navigate([`/simulation2d/${simulation._id}`]);
  }

  expandSimulation(simulationIndex: number): void{
    if (this.expandedSimulations.includes(simulationIndex)){
      this.expandedSimulations.splice(this.expandedSimulations.indexOf(simulationIndex), 1);
    }else{
      this.expandedSimulations.push(simulationIndex);
    }
  }

}
