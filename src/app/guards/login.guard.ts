/**
 * Guard to redirect user to dashboard if user is accessing
 * the login page & they are already logged in
 * 
 * @author Joanna Zhang
 * @version 27-01-2019
 */

import { Injectable } from '@angular/core'
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { AuthenticationService } from '../services/authentication.service'
import { Role } from '../models/role'

@Injectable()
export class LoginGuard implements CanActivate {

    constructor(private router: Router, private authenticationService: AuthenticationService) { }

    /**
     * Redirect user to dashboard if already logged in
     * @param route route
     * @param state state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
        console.log("login guard")
        if (localStorage.getItem('currentUser')) {
            const currentUser = this.authenticationService.currentUserVal
            if(currentUser.userObj.role === Role.Admin){
                // User is logged in. Redirect to main page. 
                this.router.navigate(['/system'], { queryParams: { returnUrl: state.url }})
                return false
            }
            // User is logged in. Redirect to main page. 
            this.router.navigate(['/user/dashboard'], { queryParams: { returnUrl: state.url }})
            return false
        }
        // Can navigate to login page - return true.
        return true
    }
}