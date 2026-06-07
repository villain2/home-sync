import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlarmMode, Camera, SecurityService, SecurityState, Sensor } from 'src/app/services/security.service';

@Component({
  selector: 'app-security-page',
  templateUrl: './security-page.component.html',
  styleUrls: ['./security-page.component.sass']
})
export class SecurityPageComponent implements OnInit, OnDestroy {

  alarmMode: AlarmMode = 'disarmed';
  cameras: Camera[] = [];
  sensors: Sensor[] = [];

  private destroy$ = new Subject<void>();

  constructor(private securityService: SecurityService) {}

  ngOnInit(): void {
    this.securityService.getState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: SecurityState) => {
        this.alarmMode = state.alarmMode;
        this.cameras = state.cameras;
        this.sensors = state.sensors;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setAlarmMode(mode: AlarmMode): void {
    this.securityService.setAlarmMode(mode);
  }

  getSensorIcon(type: Sensor['type']): string {
    const icons = {
      door: 'fa-door-closed',
      window: 'fa-window-maximize',
      motion: 'fa-running',
      smoke: 'fa-smog',
      co: 'fa-wind'
    };
    return icons[type] || 'fa-circle';
  }

  getSensorStateClass(state: Sensor['state']): string {
    return {
      closed: 'sensor--ok',
      open: 'sensor--open',
      triggered: 'sensor--triggered'
    }[state] || '';
  }

  getAlarmBadgeClass(): string {
    return {
      armed: 'badge-armed',
      away: 'badge-away',
      disarmed: 'badge-disarmed'
    }[this.alarmMode] || '';
  }

  // TODO: [STORY] 911 Emergency Call Integration
  // Implement WebRTC/SIP call to 911 with pre-scripted operator prompt.
  // Requires legal review before implementation.
  onEmergency(): void {
    console.warn('Emergency feature not yet implemented. See story: 911 Emergency Call Integration.');
  }
}
