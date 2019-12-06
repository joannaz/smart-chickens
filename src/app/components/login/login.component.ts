/**
 * Login page component
 * 
 * @author Joanna Zhang
 * @version 23-01-2019
 */

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core'
import { AuthenticationService } from '../../services/authentication.service'
import { Router, ActivatedRoute } from "@angular/router"
import { Role } from '../../models/role'
import { first } from 'rxjs/operators'
import * as crypto from 'crypto-js'
import { environment } from '../../../environments/environment'
import { Subscription } from 'rxjs'


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, OnDestroy {
  // User entered email
  username: string
  // User entered password
  password: string
  loading: boolean = false
  submitted: boolean = false
  returnUrl: string = ""
  error: string = ""
  env = environment

    /* Section for unsubscribing from Subscriptions to avoid
  memory leaks */
  subscription: Subscription = new Subscription()

  /* Inject Authentication service and Angular's router into this component */
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // If the user is already logged in, navigate to root of site
    if (this.authenticationService.currentUserVal) {
      this.router.navigate(['/']);
    }
  }

  /**
   * If we're redirected here, get the return url
   */
  ngOnInit(): void {
    // this.returnUrl = this.route.snapshot.queryParams['/'] || '/'
  }

  /**
   * This will get called when user submits their credentials
   */
  login(): void {
    this.submitted = true
    if (this.password.length < 8) {
      this.error = "Password must be a minimum of 8 characters long."
      return
    }
    this.loading = true
    this.subscription.add(this.authenticationService.login(this.username, this.password, true)
      .pipe(first())
      .subscribe(
        data => {
          if(data.userObj.role === Role.Admin){
            this.router.navigate(['/system'])
          } else {
            this.router.navigate(['/user/dashboard'])
          }
          
        },
        error => {
          this.error = error
          this.loading = false
        }
      ))
  }

  /**
   * Call login function when key press
   * @param event Key press event
   */
  keyDownFunction(event) : void {
    if (event.keyCode == 13) {
      this.login()
    }
  }

  /**
   * Destroy subscriptions to avoid memory leak
   */
  ngOnDestroy() : void {
    this.subscription.unsubscribe()
  }

}