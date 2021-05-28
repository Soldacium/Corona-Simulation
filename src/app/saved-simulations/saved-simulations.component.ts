import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-saved-simulations',
  templateUrl: './saved-simulations.component.html',
  styleUrls: ['./saved-simulations.component.scss']
})
export class SavedSimulationsComponent implements OnInit {

  expandedSimulations: number[] = [];
  simulations = [1,2,3,4];
  constructor() { }

  ngOnInit(): void {

  }

  expandSimulation(simulation: number){
    if(this.expandedSimulations.includes(simulation)){
      this.expandedSimulations.splice(this.expandedSimulations.indexOf(simulation), 1);
    }else{
      this.expandedSimulations.push(simulation);
    }
  }

}
