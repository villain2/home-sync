import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThermostatService, ThermostatState } from 'src/app/services/thermostat.service';

@Component({
  selector: 'app-thermostat',
  templateUrl: './thermostat.component.html',
  styleUrls: ['./thermostat.component.sass']
})
export class ThermostatComponent implements OnInit, AfterViewInit, OnDestroy {
  temperatureColor: string;
  thermostatValue = 72;
  hardwareTemp: number | null = null;
  isOnline = false;

  @ViewChild('thermostatRange') thermostatRange: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('verticalSlider') verticalSlider: ElementRef<HTMLInputElement> | undefined;

  private destroy$ = new Subject<void>();

  constructor(private thermostatService: ThermostatService) {}

  ngOnInit(): void {
    // Subscribe to hardware state updates
    this.thermostatService.getState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: ThermostatState) => {
        this.hardwareTemp = state.currentTemp;
        this.isOnline = state.online;
        if (state.setpoint) {
          this.thermostatValue = state.setpoint;
        }
        this.getTempColor(this.thermostatValue);
      });

    // Begin polling the Pi
    this.thermostatService.startPolling()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngAfterViewInit(): void {
    if (this.thermostatRange?.nativeElement) {
      const slider = this.thermostatRange.nativeElement;
      slider.oninput = () => {
        this.thermostatValue = +slider.value;
        this.getTempColor(this.thermostatValue);
        this.thermostatService.setSetpoint(this.thermostatValue)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            error: err => console.error('Failed to set setpoint:', err)
          });
      };
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.thermostatRange?.nativeElement) {
      this.thermostatRange.nativeElement.oninput = null;
    }
  }

  getTempColor(tempNumber: number): string {
    const temp = +tempNumber;
    const sliderBackground = this.verticalSlider?.nativeElement;
    if (!sliderBackground) {
      return '';
    }

    sliderBackground.classList.remove('cold-temp', 'hot-temp', 'warm-temp');

    if (temp > 0 && temp < 60) {
      sliderBackground.classList.add('cold-temp');
    } else if (temp > 59 && temp < 80) {
      sliderBackground.classList.add('warm-temp');
    } else if (temp > 79 && temp < 91) {
      sliderBackground.classList.add('hot-temp');
    }

    return this.temperatureColor;
  }
}
