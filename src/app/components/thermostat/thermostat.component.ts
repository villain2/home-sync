import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-thermostat',
  templateUrl: './thermostat.component.html',
  styleUrls: ['./thermostat.component.sass']
})
export class ThermostatComponent implements AfterViewInit, OnDestroy {
  temperatureColor: string;
  thermostatValue = 32;

  @ViewChild('thermostatNumber') thermostatNumber: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('thermostatRange') thermostatRange: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('verticalSlider') verticalSlider: ElementRef<HTMLInputElement> | undefined;

  ngAfterViewInit(): void {
    if (this.thermostatRange?.nativeElement) {
      const slider = this.thermostatRange.nativeElement;
      slider.oninput = () => {
        this.thermostatValue = +slider.value;
        this.getTempColor(this.thermostatValue);
      };
    }
  }

  ngOnDestroy(): void {
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
