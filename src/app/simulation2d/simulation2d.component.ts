import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Simulation2d } from '@shared/models/simulation2d';
import { SimulationsSavedService } from '@shared/services/simulations-saved.service';
import { SimulationService } from './simulation.service';

@Component({
  selector: 'app-simulation2d',
  templateUrl: './simulation2d.component.html',
  styleUrls: ['./simulation2d.component.scss']
})
export class Simulation2dComponent implements OnInit {

  hideOptions = false;

  constructor(
    private route: ActivatedRoute,
    private simulation: SimulationService,
    private savedSimulations: SimulationsSavedService) { }

  ngOnInit(): void {
    this.setupProperSimulation();
  }

  setupProperSimulation(): void{
    this.route.paramMap.subscribe(params => {
      const simId = params.get('id') as string;
      const activeSimulation = this.savedSimulations.currentSimulation2d;
      if (simId.length !== 24){
        this.simulation.newSimulation();
        this.savedSimulations.currentSimulation2d = null;
        return;
      }
      if (activeSimulation && activeSimulation._id === simId){
        this.simulation.setActiveSimulation(activeSimulation);
      }else{
        this.savedSimulations.getSimulation2d(simId).subscribe((simulation: Simulation2d) => {
          if (simulation){
            this.simulation.setActiveSimulation(simulation);
          }
        });
      }
    });
  }

}
