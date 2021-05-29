import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {

  @Input()
  checked = false;

  @Input()
  disabled = false;

  @Output() onchange:
  EventEmitter<Event> = new EventEmitter<Event>();

  emitChange(event: Event): void{
    this.onchange.emit(event)
  }
}
