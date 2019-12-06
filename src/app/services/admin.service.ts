/**
 * Service for the System account to admin user
 * accounts* 
 * 
 * @author Joanna Zhang
 * @version 19-01-2019
 */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { UserObj } from '../models/user'
import { environment } from '../../environments/environment'


@Injectable({
  providedIn: 'root',
})
export class AdminService {
  env = environment

  /**
   * Constructor for this service. HTTPClient does not need to be unsubscribed
   * @param http HTTP CLient for API requests
   */
  constructor(private http: HttpClient) { }

  /**
   * Gets all registered users
   * @returns Observable of user objects
   */
  getAll(): Observable<UserObj[]> {
    return this.http.get<UserObj[]>(`${this.env.apiUrl}/admin/getAllUsers`);
  }

  /**
   * Update a field in the user_account table
   * @param username Username of the user to be updated
   * @param field The field to be updated
   * @param value The value the field is being updated to
   * @returns Observable of true if successfully updated
   */
  updateUser(username: string, field: string, value: string) {
    return this.http.put<boolean>(`${this.env.apiUrl}/admin/updateUser`, { username, field, value });
  }

  /**
   * Delete a user
   * @param username Username of the user to be deleted
   * @returns Observable of true if successfully updated
   */
  deleteUser(username: string) {
    return this.http.delete<boolean>(`${this.env.apiUrl}/admin/deleteUser/${username}`);
  }
}