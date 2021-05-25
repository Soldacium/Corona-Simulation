import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss']
})
export class InputTextComponent {

  @Input() placeholder = '';
  @Input() label = '';
  @Input() type: 'text'|'email'|'password'|'datetime-local' = 'text';
  @Input() darkMode = false;
  @Input() textColor = 'black';

  @Input() inputModel!: string;
  @Output() inputModelChange = new EventEmitter<string>();

}
