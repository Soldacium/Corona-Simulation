import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button-three',
  templateUrl: './button-three.component.html',
  styleUrls: ['./button-three.component.scss']
})
export class ButtonThreeComponent{

  @Input()
  active = false;

  @Output() onclick:
  EventEmitter<Event> = new EventEmitter<Event>();

  clickButton(event: Event): void{
    this.onclick.emit(event);
  }

}
