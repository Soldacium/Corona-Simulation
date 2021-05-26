import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavedSimulationsComponent } from './saved-simulations.component';
import { RouterModule } from '@angular/router';
import { routes } from './routes-saved';



@NgModule({
  declarations: [
    SavedSimulationsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SavedSimulationsModule { }
