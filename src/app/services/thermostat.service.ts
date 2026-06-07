import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, throwError } from 'rxjs';
import { catchError, startWith, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export type ThermostatMode = 'heat' | 'cool' | 'fan' | 'off';

export interface ThermostatState {
  currentTemp: number | null;
  setpoint: number;
  mode: ThermostatMode;
  online: boolean;
}

const DEFAULT_STATE: ThermostatState = {
  currentTemp: null,
  setpoint: 72,
  mode: 'off',
  online: false
};

@Injectable({
  providedIn: 'root'
})
export class ThermostatService {
  private readonly baseUrl = environment.thermostatBaseUrl;

  private state$ = new BehaviorSubject<ThermostatState>(DEFAULT_STATE);

  constructor(private http: HttpClient) {}

  /** Stream of thermostat state; polls the hardware every 30 s. */
  getState(): Observable<ThermostatState> {
    return this.state$.asObservable();
  }

  /** Begin polling the Pi for current state. Call once from the component. */
  startPolling(): Observable<ThermostatState> {
    return interval(30_000).pipe(
      startWith(0),
      switchMap(() =>
        this.http.get<ThermostatState>(`${this.baseUrl}/state`).pipe(
          catchError(() => {
            this.state$.next({ ...this.state$.value, online: false });
            return [];
          })
        )
      ),
      tap((state: ThermostatState) => this.state$.next({ ...state, online: true }))
    );
  }

  /** Set HVAC mode on the Pi. */
  setMode(mode: ThermostatMode): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/mode`, { mode }).pipe(
      tap(() => this.state$.next({ ...this.state$.value, mode })),
      catchError(err => {
        console.error('Thermostat setMode failed:', err);
        return throwError(err);
      })
    );
  }

  /** Set temperature setpoint on the Pi. */
  setSetpoint(temp: number): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/setpoint`, { setpoint: temp }).pipe(
      tap(() => this.state$.next({ ...this.state$.value, setpoint: temp })),
      catchError(err => {
        console.error('Thermostat setSetpoint failed:', err);
        return throwError(err);
      })
    );
  }

  /**
   * Low-level request used by WeatherComponent for legacy PHP-based
   * GPIO control endpoints (e.g. /thermostat_control.php?action=fan_on).
   * @deprecated Prefer setMode() / setSetpoint() once Pi-side REST API
   *   is replaced with the new endpoint contract (see docs/thermostat-api.md).
   */
  sendRequest(endpoint: string): Observable<unknown> {
    if (!endpoint) {
      return throwError(new Error('Thermostat endpoint is required'));
    }
    return this.http.get(`${this.baseUrl}${endpoint}`);
  }
}
