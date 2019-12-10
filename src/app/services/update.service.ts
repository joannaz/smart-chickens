/**
 * Service to register users
 * 
 * @author Joanna Zhang, Damon Sweeney
 * @version 10-03-2019
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs';
import { Update } from '../models/data'

@Injectable({
    providedIn: 'root',
})
export class UpdateService {
    env = environment

    constructor(private http: HttpClient) { }

    /**
     * Force up to get new values from sensor
     * @param sensor String of sensor name
     */
    updateSensor(sensor: string): Observable<Update> {
        throw Observable.throw("Not connected to server")
        //return this.http.get<Update>(`${this.env.apiUrl}/update/${sensor}`)
    }
}