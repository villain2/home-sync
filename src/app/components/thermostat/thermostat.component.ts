import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-thermostat',
  templateUrl: './thermostat.component.html',
  styleUrls: ['./thermostat.component.sass']
})
export class ThermostatComponent implements AfterViewInit {
  // list elements of thermostat
  temperatureColor: string;

  @ViewChild('thermostatNumber') thermostatNumber: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('thermostatRange') thermostatRange: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('verticalSlider') verticalSlider: ElementRef<HTMLInputElement> | undefined;

  ngAfterViewInit(): void {
    if (( this.thermostatNumber?.nativeElement) && (this.thermostatRange?.nativeElement)) {
      const slider = this.thermostatRange.nativeElement;
      const tempNumber = this.thermostatNumber.nativeElement;

      slider.oninput = () => {
        const value = slider.value;
        tempNumber.innerHTML = value + `&deg;`;
        this.getTempColor(+value);
      }
    }
  }

  getTempColor(tempNumber: number): string {
    // convert tempNumber to number
    var temp: number = +tempNumber;
    const sliderBackground = this.verticalSlider.nativeElement;

    sliderBackground.classList.remove('cold-temp');
    sliderBackground.classList.remove('hot-temp');
    sliderBackground.classList.remove('warm-temp');

    if(temp > 0 && temp < 60) {
      sliderBackground.classList.add('cold-temp');
    } else if(temp > 59 && temp < 80) {
      sliderBackground.classList.add('warm-temp');
    } else if(temp > 79 && temp < 91) {
      sliderBackground.classList.add('hot-temp');
    }

    return this.temperatureColor;
  }
}
