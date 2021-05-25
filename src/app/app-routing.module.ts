import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent
  },
  {
    path: 'simulation2d',
    loadChildren: () => import('@simulation2d/simulation2d.module').then(m =>
      m.Simulation2dModule
    )
  },
  {
    path: 'simulation3d',
    loadChildren: () => import('@simulation3d/simulation3d.module').then(m =>
      m.Simulation3dModule
    )
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
