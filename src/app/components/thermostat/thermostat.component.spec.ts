import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { ThermostatComponent } from './thermostat.component';
import { ThermostatService } from 'src/app/services/thermostat.service';

describe('ThermostatComponent', () => {
  let component: ThermostatComponent;
  let fixture: ComponentFixture<ThermostatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CommonModule],
      declarations: [ThermostatComponent],
      providers: [ThermostatService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThermostatComponent);
    component = fixture.componentInstance;

    // Provide a real DOM element for verticalSlider ViewChild
    const host = fixture.nativeElement;
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'veritcal-slider';
    host.appendChild(sliderWrapper);
    component.verticalSlider = { nativeElement: sliderWrapper } as any;

    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should default isOnline to false', () => {
    expect(component.isOnline).toBe(false);
  });

  it('getTempColor adds cold-temp for 45', () => {
    component.getTempColor(45);
    expect(component.verticalSlider.nativeElement.classList).toContain('cold-temp');
  });

  it('getTempColor adds warm-temp for 70', () => {
    component.getTempColor(70);
    expect(component.verticalSlider.nativeElement.classList).toContain('warm-temp');
  });

  it('getTempColor adds hot-temp for 85', () => {
    component.getTempColor(85);
    expect(component.verticalSlider.nativeElement.classList).toContain('hot-temp');
  });
});
