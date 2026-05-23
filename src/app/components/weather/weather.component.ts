import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WeatherService } from 'src/app/services/weather.service';
import { ThermostatService } from 'src/app/services/thermostat.service';

type ThermostatButton = 'heat' | 'cool' | 'fan';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.sass']
})
export class WeatherComponent implements OnInit, OnDestroy {
  weatherData: any;
  currentTemp: string;
  currentConditions: string;
  forecastArray: string[];
  activeButton: 'heat' | 'cool' | '' = '';
  fanActive = false;
  private readonly destroy$ = new Subject<void>();

  constructor(private weatherService: WeatherService, private thermostatService: ThermostatService) { }

  ngOnInit(): void {
    this.weatherService.getWeatherData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.weatherData = data;
        this.currentTemp = this.weatherData.currentTemp;
        this.forecastArray = this.weatherData.forecast;
        this.currentConditions = this.weatherData.currentWeather;

        console.log(this.weatherData);
        console.log(this.forecastArray);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setActive(button: 'heat' | 'cool') {
    if (button === this.activeButton) {
      this.deactivateHeatOrCool(button);
    } else {
      if (this.activeButton) {
        this.sendRequest(this.activeButton, 'off');
      }
      this.activeButton = button;
      this.sendRequest(button, 'on');
      if (!this.fanActive) {
        this.sendRequest('fan', 'on');
        this.fanActive = true;
      }
    }
  }

  setFanActive() {
    this.fanActive = !this.fanActive;
    if (!this.fanActive) {
      this.sendRequest('fan', 'off');
      // Device requires fan for heat/cool; turning fan off must end the active mode.
      this.deactivateActiveHeatOrCool();
    } else {
      this.sendRequest('fan', 'on');
    }
  }

  isActive(button: string): boolean {
    if (button === 'fan') {
      return this.fanActive;
    }
    return this.activeButton === button;
  }

  private deactivateActiveHeatOrCool(): void {
    if (!this.activeButton) {
      return;
    }
    const mode = this.activeButton;
    this.activeButton = '';
    this.sendRequest(mode, 'off');
  }

  private deactivateHeatOrCool(button: 'heat' | 'cool') {
    this.activeButton = '';
    this.fanActive = false;
    this.sendRequest(button, 'off');
    this.sendRequest('fan', 'off');
  }

  private sendRequest(button: ThermostatButton, action: 'on' | 'off') {
    const endpoint = this.getEndpoint(button, action);
    if (!endpoint) {
      console.warn(`Unknown thermostat button: ${button}`);
      return;
    }
    console.log(`button ${button} and action ${action}.`);
    this.thermostatService.sendRequest(endpoint)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => console.log(response),
        error: error => console.error(error)
      });
  }

  private getEndpoint(button: ThermostatButton, action: 'on' | 'off'): string | null {
    switch (button) {
      case 'cool':
        return action === 'on' ? '/thermostat_control.php?action=cool_on' : '/thermostat_control.php?action=cool_off';
      case 'heat':
        return action === 'on' ? '/thermostat_control.php?action=heat_on' : '/thermostat_control.php?action=heat_off';
      case 'fan':
        return action === 'on' ? '/thermostat_control.php?action=fan_on' : '/thermostat_control.php?action=fan_off';
      default:
        return null;
    }
  }
}
