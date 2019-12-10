/**
 * Service to register users
 * 
 * @author Joanna Zhang
 * @version 19-01-2019
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { Observable, of } from 'rxjs';
 
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
    if(username == "user" || username == "admin") {
      return of(true)
    }

    return of(false)
    //return this.http.get<boolean>(`${this.env.apiUrl}/register/check/${username}`)
  }

  /**
   * Register the user
   * @param username new username to register
   * @param name name of user
   * @param email email of user
   * @param password user's password
   */
  register(username: string, name: string, email:string , password: string) : Observable<boolean>{
    throw Observable.throw("Not connected to server")
    //let secret = this.env.secret
    //return this.http.post<boolean>(`${this.env.apiUrl}/register/`, {username, name, email, password, secret})
  }
}