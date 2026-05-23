import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThermostatService {
  private readonly baseUrl = environment.thermostatBaseUrl;

  constructor(private http: HttpClient) { }

  sendRequest(endpoint: string): Observable<unknown> {
    if (!endpoint) {
      return throwError(() => new Error('Thermostat endpoint is required'));
    }
    return this.http.get(`${this.baseUrl}${endpoint}`);
  }
}
