import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Simulation2d } from '@shared/models/simulation2d';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SimulationsSavedService {

  constructor(private http: HttpClient) { }

  getSimulation2d(id: string): Observable<Simulation2d>{
    return this.http.get<Simulation2d>('http://localhost:3000/api/simulations2d/' + id).pipe(
      map((simulation: Simulation2d) => {
        return simulation;
      })
    );
  }

  postSimulation2d(simulation: Simulation2d){
    return this.http.post<Simulation2d>('http://localhost:3000/api/simulations2d/', simulation).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  updateSimulation2d(simulation: Simulation2d){
    return this.http.patch<Simulation2d>('http://localhost:3000/api/simulations2d/' + simulation._id, simulation).pipe(
      map((simulation: Simulation2d) => {
        return simulation;
      })
    );
  }

  deleteSimulation2d(simulation: Simulation2d){
    return this.http.delete<Simulation2d>('http://localhost:3000/api/simulations2d/' + simulation._id).pipe(
      map((simulation: Simulation2d) => {
        return simulation;
      })
    );
  }
}
