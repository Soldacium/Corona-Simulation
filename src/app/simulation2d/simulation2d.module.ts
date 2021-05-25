import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Simulation2dComponent } from './simulation2d.component';
import { RouterModule } from '@angular/router';
import { routes } from './routes-simulation2d';



@NgModule({
  declarations: [
    Simulation2dComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class Simulation2dModule { }
