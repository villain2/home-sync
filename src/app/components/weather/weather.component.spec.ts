import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { WeatherComponent } from './weather.component';
import { WeatherService } from 'src/app/services/weather.service';
import { ThermostatService } from 'src/app/services/thermostat.service';

const mockWeather = {
  location: 'Test',
  currentWeather: 'Sunny',
  currentIcon: '',
  currentTemp: '72',
  forecast: []
};

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let weatherSpy: jasmine.SpyObj<WeatherService>;
  let thermoSpy: jasmine.SpyObj<ThermostatService>; 

  beforeEach(async(() => {
    weatherSpy = jasmine.createSpyObj('WeatherService', ['getWeatherData']);
    thermoSpy = jasmine.createSpyObj('ThermostatService', ['sendRequest']);
    weatherSpy.getWeatherData.and.returnValue(of(mockWeather));
    thermoSpy.sendRequest.and.returnValue(of({}));
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CommonModule],
      declarations: [WeatherComponent],
      providers: [
        { provide: WeatherService, useValue: weatherSpy },
        { provide: ThermostatService, useValue: thermoSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
  }).compileComponents();

}));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load weather', () => {
    expect(component).toBeTruthy();
    expect(component.currentTemp).toBe('72');
    expect(component.currentConditions).toBe('Sunny');
  });

  it('setActive toggles and calls thermostat', () => {
    component.setActive('heat');
    expect(component.activeButton).toBe('heat');
    expect(component.fanActive).toBeTrue();
  });

});