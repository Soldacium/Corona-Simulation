import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputRangeComponent } from './components/input-range/input-range.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { ButtonFlatDirective } from './directives/button-flat.directive';
import { OptionsWrapComponent } from './components/options-wrap/options-wrap.component';
import { ButtonStrokedDirective } from './directives/button-stroked.directive';
import { ButtonThreeComponent } from './components/button-three/button-three.component';



@NgModule({
  declarations: [
    InputRangeComponent,
    InputTextComponent,
    ButtonFlatDirective,
    OptionsWrapComponent,
    ButtonStrokedDirective,
    ButtonThreeComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    InputRangeComponent,
    InputTextComponent,
    ButtonFlatDirective,
    ButtonStrokedDirective,
    ButtonThreeComponent

  ]
})
export class SharedModule { }
