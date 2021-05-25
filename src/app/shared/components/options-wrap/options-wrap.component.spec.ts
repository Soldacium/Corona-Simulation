import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsWrapComponent } from './options-wrap.component';

describe('OptionsWrapComponent', () => {
  let component: OptionsWrapComponent;
  let fixture: ComponentFixture<OptionsWrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionsWrapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
