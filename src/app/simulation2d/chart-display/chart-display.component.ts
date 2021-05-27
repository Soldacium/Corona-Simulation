import { Component, OnInit } from '@angular/core';
import { SimulationService } from '@simulation2d/simulation.service';
import { LineChartData } from '@shared/models/chart-data-line';
import { PieChartData } from '@shared/models/chart-data-pie';

@Component({
  selector: 'app-chart-display',
  templateUrl: './chart-display.component.html',
  styleUrls: ['./chart-display.component.scss']
})
export class ChartDisplayComponent implements OnInit {

  lineChartArr: LineChartData[] = [];
  pieChartArr: PieChartData[] = [];
  examinedDay = 0;
  chartType = 'line-normal';

  legend = true;
  showLabels = true;
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = 'Day';
  yAxisLabel = 'Population';
  timeline = true;

  colorScheme = {
    domain: ['#00ff99', '#e6005c', '#CFC0BB', '#7aa3e5', '#a8385d', '#000000']
  };

  constructor(private simulationService: SimulationService) {

  }

  ngOnInit(): void {
    this.getLineChartData();
  }

  pickChartType(chartType: string): void{
    this.chartType = chartType;
  }

  getLineChartData(): void{
    this.lineChartArr = this.simulationService.getChartData();
    this.simulationService.LineChartDataEmmiter.subscribe((data: LineChartData[]) => {
      this.lineChartArr = data;
    });
  }

  getPieChartData(): void{
    this.pieChartArr = this.simulationService.getPieChartData(this.examinedDay);
  }

}
