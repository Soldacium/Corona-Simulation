import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appButtonFlat]'
})
export class ButtonFlatDirective {

  @Input() defaultColor = 'var(--colorAccent3)';
  @Input() hoverColor = '#20ff44';
  @Input() fontSize = '2rem';
  @Input() active = false;

  @HostListener('mouseenter') onMouseEnter(): void {
    this.el.nativeElement.style.cursor = 'pointer';
    this.highlight(this.hoverColor);
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.highlight(this.defaultColor);
  }

  private highlight(color: string): void {
    this.el.nativeElement.style.backgroundColor = color;
  }
  constructor(private el: ElementRef) {
    const buttonStyle = el.nativeElement.style;
    buttonStyle.backgroundColor = this.defaultColor;
    buttonStyle.border = 'none';
    buttonStyle['font-size'] = this.fontSize;
    buttonStyle.padding = '0.5rem 1rem';
    buttonStyle.transition = '0.2s ease background-color';
    buttonStyle.cursor = 'pointer';
    buttonStyle.color = 'white';
    if (this.active){
      buttonStyle.backgroundColor = '#232323';
    }
  }
}
