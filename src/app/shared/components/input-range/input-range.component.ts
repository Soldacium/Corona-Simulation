import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-range',
  templateUrl: './input-range.component.html',
  styleUrls: ['./input-range.component.scss']
})
export class InputRangeComponent implements OnInit {

  @Input()
  min!: number;

  @Input()
  max!: number;

  @Input()
  value!: number;

  @Input()
  step = 1;

  @Input()
  icon = '';

  @Input()
  disabled = false;

  @Output() onclick:
  EventEmitter<Event> = new EventEmitter<Event>();

  @Input() inputModel = 0;
  @Output() inputModelChange = new EventEmitter<number>();

  numOfBreakpoints = 2;
  breakpoints: number[] = [];

  ngOnInit(): void {
    const medium = this.max / 2;
    this.breakpoints.push(this.min, medium, this.max);
  }
}
