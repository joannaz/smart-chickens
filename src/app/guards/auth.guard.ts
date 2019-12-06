/**
 * Guard to only let the user navigate if they are logged in
 * 
 * @author Joanna Zhang
 * @version 25-01-2019
 */

import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service'
import { Role } from '../models/role'

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authenticationService: AuthenticationService) { }

    /**
     * Check if user is authenticated for this page
     * @param route route
     * @param state return url
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
        const currentUser = this.authenticationService.currentUserVal
        if (currentUser) {
            // check if route is restricted by role
            if (currentUser.userObj.role === Role.Admin) {
                // role not authorised so redirect to home page
                this.router.navigate(['/system/dashboard'])
                return false
            }

            // authorised so return true
            return true
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
        return false
}



}