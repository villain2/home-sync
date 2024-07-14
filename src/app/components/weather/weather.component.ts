import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.sass']
})
export class WeatherComponent implements OnInit {
  weatherData: any;
  currentTemp: string;
  currentConditions: string;
  forecastArray: string[];
  activeButton: string = '';
  fanActive: boolean = false; // Track the state of the fan button

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.weatherService.getWeatherData().subscribe(data => {
      this.weatherData = data;
      this.currentTemp = this.weatherData.currentTemp;
      this.forecastArray = this.weatherData.forecast;
      this.currentConditions = this.weatherData.currentWeather;

      console.log(this.weatherData)
      console.log(this.forecastArray)
    });
  }

  setActive(button: string) {
    if (button === this.activeButton) {
      // If the clicked button is already active, deactivate it and the fan
      this.activeButton = '';
      this.fanActive = false;
    } else {
      // Activate the clicked button and also the fan
      this.activeButton = button;
      this.fanActive = true;
    }
  }

  setFanActive() {
    // Toggle the fan button independently
    this.fanActive = !this.fanActive;
    // If the fan is deactivated, deactivate the heat and cool buttons as well
    if (!this.fanActive) {
      this.activeButton = '';
    }
  }

  isActive(button: string): boolean {
    if (button === 'fan') {
      return this.fanActive;
    }
    return this.activeButton === button;
  }
}
