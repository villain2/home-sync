import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { SecurityPageComponent } from './security-page.component';
import { SecurityService } from 'src/app/services/security.service';

describe('SecurityPageComponent', () => {
  let component: SecurityPageComponent;
  let fixture: ComponentFixture<SecurityPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ SecurityPageComponent ],
      providers: [ SecurityService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default alarm mode to disarmed', () => {
    expect(component.alarmMode).toBe('disarmed');
  });

  it('should load cameras and sensors from service', () => {
    expect(component.cameras.length).toBeGreaterThan(0);
    expect(component.sensors.length).toBeGreaterThan(0);
  });

  it('should update alarm mode when setAlarmMode is called', () => {
    component.setAlarmMode('armed');
    expect(component.alarmMode).toBe('armed');
  });

  it('should return correct badge class for each alarm mode', () => {
    component.alarmMode = 'armed';
    expect(component.getAlarmBadgeClass()).toBe('badge-armed');
    component.alarmMode = 'away';
    expect(component.getAlarmBadgeClass()).toBe('badge-away');
    component.alarmMode = 'disarmed';
    expect(component.getAlarmBadgeClass()).toBe('badge-disarmed');
  });
});
