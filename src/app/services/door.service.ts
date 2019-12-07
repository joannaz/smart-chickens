import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserObj } from '../models/user'
import { environment } from '../../environments/environment'

import { Observable, of } from 'rxjs';

import { Door, DoorOptions, DoorResponse } from '../models/door';

@Injectable({
  providedIn: 'root',
})
export class DoorService {
  env = environment

  constructor(private http: HttpClient) { }

  /**
   * Returns the dummy door object
   * @returns Observable of most recent door data
   */
  getDoorStatus(): Observable<Door> {
    return this.http.get<Door>(`${this.env.apiUrl}/door/getDoorStatus`)
  }

  /**
   * Returns door options
   * @returns Door Settings
   */
  getDoorOptions(): Observable<DoorOptions> {
    return this.http.get<DoorOptions>(`${this.env.apiUrl}/system/getDoorSettings`)
  }

  /**
   * Update door Options
   * @returns Observable of true if updated
   */
  updateDoorOptions(open_door, close_door){
    return this.http.put<boolean>(`${this.env.apiUrl}/system/updateDoorSettings`, {open_door, close_door})
  }

    /**
   * Reset user defined automation to be off.
   */
  cancelAutomation() : Observable<Boolean>{
    return this.http.get<boolean>(`${this.env.apiUrl}/system/resetDoorSettings`)
  }

  /**
   * Get past day worth of door data
   * @returns past day worth of door data
   */
  getDoorStatusPastDay(): Observable<Door[]> {
    return this.http.get<Door[]>(`${this.env.apiUrl}/door/getPastDay`)
  }

  /**
   * Opens door
   * @returns Observable of true if opened
   */
  openDoor(): Observable<DoorResponse> {
    return this.http.get<DoorResponse>(`${this.env.apiUrl}/door/open`)
  }

  /**
   * Closes door
   * @returns Observable of true if closed
   */
  closeDoor(): Observable<DoorResponse> {
    return this.http.get<DoorResponse>(`${this.env.apiUrl}/door/close`)
  }
}