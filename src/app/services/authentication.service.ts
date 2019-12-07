/**
 * Service for user authentication
 * accounts* 
 * 
 * @author Joanna Zhang
 * @version 19-01-2019
 */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { environment } from '../../environments/environment'
import { User, UserObj } from '../models/user'
import { Role } from '../models/role';

@Injectable({
    providedIn: 'root',
})

export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>
    public currentUser: Observable<User>
    env = environment

    /**
     * Constructor for this service. 
     * @param http HTTP Client for API requests
     */
    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')))
        this.currentUser = this.currentUserSubject.asObservable()
    }

    /**
     * Getter for current user object
     * @returns Current user object
     */
    public get currentUserVal(): User {
        return this.currentUserSubject.value
    }

    /**
     * Try to log the user in with the given username and password
     * @param username User entered username
     * @param password User entered password
     * @param updateStorage Whether to update local storage
     * @returns The logged in user
     */
    login(username: string, password: string, updateStorage: boolean)  : Observable<User>{
        let user: UserObj = {
            door_control: true,
            name: 'Test User',
            role: Role.User,
            username: 'user',
            verified: true,
            default_pic: true
          } 
      
          let admin: UserObj = {
            door_control: true,
            name: 'Admin User',
            role: Role.Admin,
            username: 'admin',
            verified: true,
            default_pic: true
          } 

          let currUser: User;
          if (username == "user" && password == "password"){
              currUser = {
                token: "test",
                userObj: user
              }
          }
          else if (username == "admin" && password == "password"){
              currUser = {
                token: "test",
                userObj: admin
                }
        }
        
        if (currUser && currUser.token && updateStorage) {
            // Locally store user obj and jwt token to keep user logged in
            localStorage.setItem('currentUser', JSON.stringify(currUser))
            this.currentUserSubject.next(currUser)
            return of(currUser)
        }

        throw Observable.throw("Invalid password")
    }

    /**
     * Refreshes the current logged in user values
     * @returns the updated logged in user values
     */
    refreshUser() : Observable<User> {
        let user = JSON.parse(localStorage.getItem('currentUser'))
        return of(user)
    }
    /**
     * Logout the current user
     */
    logout(): void {
        // Simple remove current user locally and set the user subject to null
        localStorage.removeItem('currentUser')
        this.currentUserSubject.next(null)
    }
}