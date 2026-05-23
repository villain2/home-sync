import { TestBed } from '@angular/core/testing';

import { ThermostatService } from './thermostat.service';

describe('ThermostatService', () => {
  let service: ThermostatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThermostatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
