import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputRangeComponent } from './components/input-range/input-range.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { ButtonFlatDirective } from './directives/button-flat.directive';



@NgModule({
  declarations: [
    InputRangeComponent,
    InputTextComponent,
    ButtonFlatDirective
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[
    InputRangeComponent,
    InputTextComponent,
    ButtonFlatDirective
  ]
})
export class SharedModule { }
