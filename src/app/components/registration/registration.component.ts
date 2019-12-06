/**
 * Registration page
 * 
 * @author Joanna Zhang
 * @version 27-01-2019
 */

import { Component, OnDestroy } from '@angular/core';
import { RegisterService } from '../../services/register.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.less']
})
export class RegistrationComponent implements OnDestroy {
  username: string
  name: string
  email: string
  postcode: string
  password: string
  cpassword: string
  err: boolean = false
  errMsg: string = ""
  success: boolean = false
  submitted: boolean = false

  /* Section for unsubscribing from Subscriptions to avoid
  memory leaks */
  subscription: Subscription = new Subscription()

  /**
   * Constructor for this registration component
   * @param registerService To register the user
   */
  constructor(private registerService: RegisterService) { }

  /**
   * Register the user
   */
  register() : void{
    // Check if both passwords match
    if (this.password != this.cpassword) {
      this.err = true
      this.errMsg = "Both passwords must match."
      return
    }

    // Check if email is valid
    let emailRegex = new RegExp('[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+.[a-zA-Z0-9._-]+(.[a-zA-Z0-9._-]+)?')

    if (!emailRegex.test(this.email)) {
      this.err = true
      this.errMsg = "Please enter a valid email."
      return
    }

    // Check if username exists
    this.subscription.add(this.registerService.checkUsernameExists(this.username).subscribe(x => {
      // If it doesnt, register user
      if (!x) {
        this.submitted = true
        this.subscription.add(this.registerService.register(this.username, this.name, this.email, this.password)
          .subscribe(x => {
            this.success = x
            this.err = false
            this.errMsg = ""
          }))
      } else {
        // Username exists, display error
        this.err = true
        this.errMsg = "This username already exists, please try again."
        return
      }
    }))
  }

  /**
   * Used to submit form
   * @param event key press event
   */
  keyDownFunction(event) : void {
    if (event.keyCode == 13) {
      this.register()
    }
  }

  ngOnDestroy() : void {
    this.subscription.unsubscribe()
  }

}
