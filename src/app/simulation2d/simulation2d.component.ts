import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    this.route.paramMap.subscribe(params => {
      console.log(params.get('id'));
    });
  }

  getSavedSimulation(id: string){
    if(id === 'new'){

    }else{
      
    }
  }

}
