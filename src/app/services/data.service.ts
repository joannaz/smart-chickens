/**
 * Service to get data
 * 
 * @author Joanna Zhang
 * @version 19-01-2019
 */
import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Data, HisData, Log } from '../models/data'
import { Observable } from 'rxjs'
 
@Injectable({
  providedIn: 'root',
})
export class DataService {
    env = environment

  constructor(private http: HttpClient) { }
 
  /**
   * Gets current data
   * @returns an observable of all current data
   */
  getcurrentData() : Observable<Data> {
    return this.http.get<Data>(`${this.env.apiUrl}/data/getCurrentData`);    
  }

  /**
   * Get water values
   * @param limit number of values returned
   * @returns an Observable of historical data
   */
  getWaterValues(limit : number) : Observable<HisData> {
    return this.http.get<HisData>(`${this.env.apiUrl}/data/getWaterValues/${limit}`);
  }

  /**
   * Get Temperature values
   * @param limit number of values returned
   * @returns an Obsrvable of historical data
   */
  getTempValues(limit : number) : Observable<HisData> {
    return this.http.get<HisData>(`${this.env.apiUrl}/data/getTempValues/${limit}`);
  }

  
  /**
   * Get Humidity values
   * @param limit number of values returned
   * @returns an Observable of historical data
   */
  getHumidValues(limit : number) : Observable<HisData> {
    return this.http.get<HisData>(`${this.env.apiUrl}/data/getHumidValues/${limit}`);
  }

  /**
   * Get Dust values
   * @param limit number of values returned
   * @returns an Observable of historical data
   */
  getDustValues(limit : number) : Observable<HisData> {
    return this.http.get<HisData>(`${this.env.apiUrl}/data/getDustValues/${limit}`);
  }

  /**
   * Get Pressure values
   * @param limit number of values returned
   * @returns an Observable of historical data
   */
  getPressureValues(limit : number) : Observable<HisData> {
    return this.http.get<HisData>(`${this.env.apiUrl}/data/getPressureValues/${limit}`);
  }

  /**
   * Get Logs
   * @returns an Observable of logs
   */
  getLogs() : Observable<Log> {
    return this.http.get<Log>(`${this.env.apiUrl}/data/getLogs/`);
  }

}