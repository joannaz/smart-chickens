/**
 * Service to register users
 * 
 * @author Joanna Zhang
 * @version 19-01-2019
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root',
})
export class RegisterService {
    env = environment
 
  constructor(private http: HttpClient) { }

  /**
   * Check if username exists
   * @param username username to check
   * @returns Observable of true if username exists
   */
  checkUsernameExists(username: string) : Observable<boolean> {
    return this.http.get<boolean>(`${this.env.apiUrl}/register/check/${username}`)
  }

  /**
   * Register the user
   * @param username new username to register
   * @param name name of user
   * @param email email of user
   * @param password user's password
   */
  register(username: string, name: string, email:string , password: string) : Observable<boolean>{
    let secret = this.env.secret
    return this.http.post<boolean>(`${this.env.apiUrl}/register/`, {username, name, email, password, secret})
  }
}