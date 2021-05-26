import { Component, OnInit } from '@angular/core';
import { SimulationService } from '@simulation2d/simulation.service';

@Component({
  selector: 'app-chart-display',
  templateUrl: './chart-display.component.html',
  styleUrls: ['./chart-display.component.scss']
})
export class ChartDisplayComponent implements OnInit {

  arr: any[] = [];
  view: [number, number] = [window.innerWidth * 2 / 3, window.innerHeight * 2 / 3];

  // options
  legend = true;
  showLabels = true;
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = 'Year';
  yAxisLabel = 'Population';
  timeline = true;

  pauseAnimation = false;

  colorScheme = {
    domain: ['#00ff99', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#000000']
  };

  constructor(private simulationService: SimulationService) {

  }

  ngOnInit(): void {
    this.arr = this.simulationService.getChartData();

    this.simulationService.LineChartDataEmmiter.subscribe((data: any) => {
      this.arr = data;
    });
  }
}
