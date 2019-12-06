/**
 * Service for system admin
 * 
 * @author Joanna Zhang
 * @version 10-02-2019
 */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Location } from '../models/location'
import { Observable } from 'rxjs'
 
@Injectable({
  providedIn: 'root',
})
export class SystemService {
    env = environment
    secret = this.env.systemSecret

 
  constructor(private http: HttpClient) { }

  /**
   * Gets the location of the user
   * @returns Observable of Location
   */
  getLocation() : Observable<Location>{
    return this.http.get<Location>(`${this.env.apiUrl}/system/getLocation`)
  }

  /**
   * Save user updated location
   * @param lat latitude
   * @param long longitude
   * @returns Observable of true if saved
   */
  saveLocation(lat : string, long : string) : Observable<boolean> {
    return this.http.post<any>(`${this.env.apiUrl}/system/updateLocation`, { lat, long })
  }

  /**
   * Gets the hub url
   * @returns the Observable with the hub url
   */
  getHubUrl(): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/system/huburl`)
  }

  /**
   * Update Hub url on settings page
   * @returns Observable of true if updated
   */
  updateHubUrl(url) : Observable<boolean> {
    return this.http.post<any>(`${this.env.apiUrl}/system/updateHubUrl`, { url })
  }



  /*********************************************************************
   * SERVICES FOR FIRST TIME SETUP
   *********************************************************************/

    /**
   * Save user updated location
   * @param lat latitude
   * @param long longitude
   * @returns Observable of true if saved
   */
  setLocation(lat : string, long : string) : Observable<boolean> {
    let secret = this.env.systemSecret
    return this.http.post<any>(`${this.env.apiUrl}/system/setup/setLocNoAuth`, { secret, lat, long })
  }


  /**
   * Gets if first time setup must happen
   * @returns Observable of true if first time setup needs to be run
   */
  getFirstTimeSetup() : Observable<boolean> {
    console.log("Test")
    return this.http.get<boolean>(`${this.env.apiUrl}/system/setup`)
  }

  /**
   * Update hub url
   * @param url hub url to update
   * @returns Observable of true if updated successfully
   */
  updateHubUrlSetup(url: string) : Observable<boolean> {
    let secret = this.env.systemSecret
    return this.http.post<any>(`${this.env.apiUrl}/system/setup/updateHubUrl`, { secret , url })
  }

  /**
   * Update system password
   * @param password password
   * @returns Observable of true if successfully updated
   */
  updateSystemPassword(password: string) : Observable<boolean> {
    let secret = this.env.systemSecret
    return this.http.post<any>(`${this.env.apiUrl}/system/setup/updateSystemPw`, { secret, password })
  }

  /**
   * Set first time setup to be false
   * @returns Observable of true if updated correctly
   */
  finishFirstTimeSetup() : Observable<boolean> {
    let secret = this.env.systemSecret
    return this.http.post<any>(`${this.env.apiUrl}/system/setup/finishSetup`, {secret})
  }

}