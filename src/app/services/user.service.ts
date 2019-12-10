/**
 * Service to update user settings
 * 
 * @author Joanna Zhang
 * @version 10-02-2019
 */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Emails } from '../models/user'
import { environment } from '../../environments/environment'
import { Observable, of } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  env = environment

  constructor(private http: HttpClient) { }

  /**
   * Get the user's email
   * @param username the username of the user
   * @returns the list of emails as an observable
   */
  getEmail(username: string): Observable<Emails> {
    let email1:string = "myemail@email.com"
    let email2:string = "test@test.com"
    let listOfEmails:string[] = [email1, email2]
    
    let emails: Emails = {
      emails: listOfEmails
    }

    return of(emails)
    //return this.http.get<Emails>(`${this.env.apiUrl}/users/emails/${username}`);
  }

  /**
   * Update the user
   * @param username username to be updated
   * @param field field to be updated
   * @param value value to be changed
   * @returns Observable of true if successfully updated
   */
  updateUser(username: string, field: string, value: string): Observable<boolean> {
    throw Observable.throw("Not connected to server")
    //return this.http.put<boolean>(`${this.env.apiUrl}/system/updateUser`, { username, field, value });
  }

  /**
   * Delete user
   * @param username the username of the user to be deleted
   * @returns Observable of true if successfully updated
   */
  deleteUser(username: string): Observable<boolean> {
    throw Observable.throw("Not connected to server")
    //return this.http.delete<boolean>(`${this.env.apiUrl}/system/deleteUser/${username}`);
  }

  /**
   * Add email to the user
   * @param email the email to be added
   * @param username the username for the email to be added to
   * @returns Observable of true if successfully updated
   */
  addEmail(email: string, username: string): Observable<boolean> {
    throw Observable.throw("Not connected to server")
    //return this.http.post<boolean>(`${this.env.apiUrl}/users/addEmail`, { email, username })
  }

  /**
   * Delete email
   * @param email The email to be deleted 
   * @returns Observable of true if successfully updated
   */
  deleteEmail(email: string): Observable<boolean> {
    throw Observable.throw("Not connected to server")
    //return this.http.delete<boolean>(`${this.env.apiUrl}/users/deleteEmail/${email}`)
  }

  /**
   * Change the user's password
   * @param username Username of the user
   * @param oldPassword Users old pw for verification
   * @param newPassword New password to change to
   * @returns Observable of true if successfully updated
   */
  changePassword(username: string, oldPassword: string, newPassword: string): Observable<boolean> {
    throw Observable.throw("Not connected to server")
    //return this.http.post<boolean>(`${this.env.apiUrl}/users/updatePassword`, { username, oldPassword, newPassword })
  }
}