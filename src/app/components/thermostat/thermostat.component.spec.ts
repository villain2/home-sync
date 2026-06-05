import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ThermostatComponent } from './thermostat.component';

describe('ThermostatComponent', () => {
  let component: ThermostatComponent;
  let fixture: ComponentFixture<ThermostatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThermostatComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThermostatComponent);
    component = fixture.componentInstance;
    // ensure DOM elements exist for ViewChild
    const host = fixture.nativeElement;
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'veritcal-slider';
    sliderWrapper.setAttribute('id', 'vertical');
    host.appendChild(sliderWrapper);

    const vertical = fixture.nativeElement.querySelector('.veritcal-slider');
    // emulate expected element for class toggling
    component.verticalSlider = { nativeElement: vertical } as any;

    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('getTempColor adds cold-temp for 45', () => {
    component.getTempColor(45);
    expect(component.verticalSlider!.nativeElement.classList).toContain('cold-temp');
  });

  it('getTempColor adds warm-temp for 70', () => {
    component.getTempColor(70);
    expect(component.verticalSlider!.nativeElement.classList).toContain('warm-temp');
  });

  it('getTempColor adds hot-temp for 85', () => {
    component.getTempColor(85);
    expect(component.verticalSlider!.nativeElement.classList).toContain('hot-temp');
  });

});