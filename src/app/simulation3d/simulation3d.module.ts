import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Simulation3dComponent } from './simulation3d.component';
import { RouterModule } from '@angular/router';
import { routes } from './routes-simulation3d';
import { SimulationDisplayComponent } from './simulation-display/simulation-display.component';


@NgModule({
  declarations: [
    Simulation3dComponent,
    SimulationDisplayComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class Simulation3dModule { }
