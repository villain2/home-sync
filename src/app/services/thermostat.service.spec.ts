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

it('should error when endpoint is empty', (done) => {
service.sendRequest('').subscribe({
next: () => fail('expected error'),
error: (err: Error) => { expect(err.message).toContain('Thermostat endpoint is required'); done(); }
});
});

it('should GET the thermostat endpoint', () => {
service.sendRequest('/thermostat_control.php?action=fan_on').subscribe();
const req = httpMock.expectOne(r => r.url.includes('thermostat_control.php'));
expect(req.request.method).toBe('GET');
req.flush({});
});

});