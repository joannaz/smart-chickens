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
import { User } from '../models/user'

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
        let url = "/users/authenticate"
        return this.http.post<User>(`${this.env.apiUrl}${url}`, { username, password })
            .pipe(map(user => {
                // Check if there is a jwt token in the response
                if (user && user.token && updateStorage) {
                    // Locally store user obj and jwt token to keep user logged in
                    localStorage.setItem('currentUser', JSON.stringify(user))
                    this.currentUserSubject.next(user)
                }
                return user
            }
        ))
    }

    /**
     * Refreshes the current logged in user values
     * @returns the updated logged in user values
     */
    refreshUser() : Observable<User>{
        let url = "/users/refreshUser"
        return this.http.post<User>(`${this.env.apiUrl}${url}`, { })
            .pipe(map(user => {
                // Check if there is a jwt token in the response
                if (user && user.token) {
                    // Locally store user obj and jwt token to keep user logged in
                    localStorage.setItem('currentUser', JSON.stringify(user))
                    this.currentUserSubject.next(user)
                }
                return user
            }
        ))
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