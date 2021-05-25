import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Simulation2dComponent } from './simulation2d.component';
import { RouterModule } from '@angular/router';
import { routes } from './routes-simulation2d';
import { OptionsComponent } from './options/options.component';
import { ChartDisplayComponent } from './chart-display/chart-display.component';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    Simulation2dComponent,
    OptionsComponent,
    ChartDisplayComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class Simulation2dModule { }
