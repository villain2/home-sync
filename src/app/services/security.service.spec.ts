import { TestBed } from '@angular/core/testing';
import { SecurityService } from './security.service';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecurityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit initial state with cameras and sensors', (done) => {
    service.getState().subscribe(state => {
      expect(state.cameras.length).toBeGreaterThan(0);
      expect(state.sensors.length).toBeGreaterThan(0);
      expect(state.alarmMode).toBe('disarmed');
      done();
    });
  });

  it('should update alarm mode', (done) => {
    service.setAlarmMode('armed');
    service.getState().subscribe(state => {
      expect(state.alarmMode).toBe('armed');
      done();
    });
  });
});
