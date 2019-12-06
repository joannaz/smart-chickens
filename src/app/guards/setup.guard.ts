/**
 * Guard to check if user can navigate to the setup page
 * 
 * @author Joanna Zhang
 * @version 27-02-2019
 */

import { Injectable } from '@angular/core'
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { SystemService } from '../services/system.service'
import { catchError, map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { of } from 'rxjs'

@Injectable()
export class SetupGuard implements CanActivate {
    setup: boolean

    constructor(private router: Router, private systemService: SystemService) { }

    /**
     * Allow user to do first time setup, otherwise redirect to login
     * @param route route
     * @param state state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        console.log("setup guard")
        return this.systemService.getFirstTimeSetup().pipe(
            map(e => {
                if (e) {
                    return (true)
                } else {
                    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
                    return false
                }
            }),
            catchError((err => {
                this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
                return of(false)
            }))
        )


    }
}