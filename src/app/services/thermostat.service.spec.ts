import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ThermostatService } from './thermostat.service';

describe('ThermostatService', () => {
  let service: ThermostatService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ThermostatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => expect(service).toBeTruthy());

  it('should error when sendRequest endpoint is empty', (done) => {
    service.sendRequest('').subscribe({
      next: () => fail('expected error'),
      error: (err: Error) => {
        expect(err.message).toContain('Thermostat endpoint is required');
        done();
      }
    });
  });

  it('should GET the thermostat endpoint via sendRequest', () => {
    service.sendRequest('/thermostat_control.php?action=fan_on').subscribe();
    const req = httpMock.expectOne(r => r.url.includes('thermostat_control.php'));
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should POST to /mode via setMode', () => {
    service.setMode('cool').subscribe();
    const req = httpMock.expectOne(r => r.url.includes('/mode'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ mode: 'cool' });
    req.flush({});
  });

  it('should POST to /setpoint via setSetpoint', () => {
    service.setSetpoint(72).subscribe();
    const req = httpMock.expectOne(r => r.url.includes('/setpoint'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ setpoint: 72 });
    req.flush({});
  });

  it('should emit default offline state on init', (done) => {
    service.getState().subscribe(state => {
      expect(state.online).toBe(false);
      done();
    });
  });
});
