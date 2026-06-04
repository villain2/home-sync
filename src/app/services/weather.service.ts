import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private url = `https://forecast.weather.gov/MapClick.php?lat=${environment.weatherLat}&lon=${environment.weatherLon}&unit=0&lg=english&FcstType=dwml`;

  constructor(private http: HttpClient) { }

  getWeatherData(): Observable<any> {
    return this.http.get(this.url, { responseType: 'text' }).pipe(
      map((xmlString: string) => this.parseXML(xmlString))
    );
  }

  private parseXML(xmlString: string): any {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, 'application/xml');
    const forecast: any[] = [];

    const location = xml.querySelector('location > description')?.textContent || '';

    const currentWeatherNode = xml.querySelector('data > parameters > weather > weather-conditions');
    const currentWeather = currentWeatherNode?.getAttribute('weather-summary') || '';
    const currentIcon = xml.querySelector('data > parameters > conditions-icon > icon-link')?.textContent || '';
    const currentTempNode = xml.querySelector('data > parameters > temperature[type="apparent"] > value');
    const currentTemp = currentTempNode?.textContent || '';

    const timeLayout = Array.from(xml.querySelectorAll('time-layout')).find(layout => layout.querySelector('layout-key'));
    const startValidTimes = timeLayout ? Array.from(timeLayout.querySelectorAll('start-valid-time')) : [];
    const periodNames = startValidTimes.length > 0 ? startValidTimes.slice(0, 8).map(node => node.getAttribute('period-name')) : [];

    const temperatureNodes = Array.from(xml.querySelectorAll('parameters > temperature'));
    const minTemps = temperatureNodes.find(node => node.getAttribute('type') === 'minimum');
    const maxTemps = temperatureNodes.find(node => node.getAttribute('type') === 'maximum');

    const weatherConditions = Array.from(xml.querySelectorAll('parameters > weather > weather-conditions'));
    const iconLinks = Array.from(xml.querySelectorAll('parameters > conditions-icon > icon-link'));

    for (let i = 0; i < 4; i++) {
      forecast.push({
        period: periodNames[i * 2],
        minTemp: minTemps?.querySelectorAll('value')[i]?.textContent,
        maxTemp: maxTemps?.querySelectorAll('value')[i]?.textContent,
        weather: weatherConditions[i * 2]?.getAttribute('weather-summary'),
        icon: iconLinks[i * 2]?.textContent
      });
    }

    return {
      location,
      currentWeather,
      currentIcon,
      currentTemp,
      forecast
    };
  }
}

