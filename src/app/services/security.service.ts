import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type AlarmMode = 'armed' | 'away' | 'disarmed';
export type SensorState = 'closed' | 'open' | 'triggered';

export interface Camera {
  id: string;
  name: string;
  streamUrl: string;
}

export interface Sensor {
  id: string;
  name: string;
  type: 'door' | 'window' | 'motion' | 'smoke' | 'co';
  state: SensorState;
  lastSeen: Date;
}

export interface SecurityState {
  alarmMode: AlarmMode;
  cameras: Camera[];
  sensors: Sensor[];
}

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private state$ = new BehaviorSubject<SecurityState>({
    alarmMode: 'disarmed',
    cameras: [
      { id: 'cam-1', name: 'Front Door', streamUrl: '' },
      { id: 'cam-2', name: 'Back Door', streamUrl: '' },
      { id: 'cam-3', name: 'Garage', streamUrl: '' },
      { id: 'cam-4', name: 'Driveway', streamUrl: '' },
    ],
    sensors: [
      { id: 's-1', name: 'Front Door', type: 'door', state: 'closed', lastSeen: new Date() },
      { id: 's-2', name: 'Back Door', type: 'door', state: 'closed', lastSeen: new Date() },
      { id: 's-3', name: 'Garage Door', type: 'door', state: 'closed', lastSeen: new Date() },
      { id: 's-4', name: 'Living Room Window', type: 'window', state: 'closed', lastSeen: new Date() },
      { id: 's-5', name: 'Bedroom Window', type: 'window', state: 'closed', lastSeen: new Date() },
      { id: 's-6', name: 'Motion Sensor (Living Room)', type: 'motion', state: 'closed', lastSeen: new Date() },
      { id: 's-7', name: 'Smoke Detector', type: 'smoke', state: 'closed', lastSeen: new Date() },
      { id: 's-8', name: 'CO Sensor', type: 'co', state: 'closed', lastSeen: new Date() },
    ]
  });

  getState(): Observable<SecurityState> {
    return this.state$.asObservable();
  }

  setAlarmMode(mode: AlarmMode): void {
    this.state$.next({ ...this.state$.value, alarmMode: mode });
  }
}
