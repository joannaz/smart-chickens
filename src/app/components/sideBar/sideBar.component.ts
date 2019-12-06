/**
 * Layout for logged in pages
 * 
 * @author Joanna Zhang
 * @version 19-01-2019
 */
import { MediaMatcher } from '@angular/cdk/layout'
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { User } from '../../models/user';
import { AuthenticationService } from '../../services/authentication.service'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { environment } from '../../../environments/environment'


@Component({
  selector: 'side-bar',
  templateUrl: './sideBar.component.html',
  styleUrls: ['./sideBar.component.less']
})
export class SideBarComponent implements OnDestroy, OnInit {

  userUrl = environment.apiUrl + "/uploads/" + this.authenticationService.currentUserVal.userObj.username


  // Gets the breakpoints for current viewport size in accordance with Material Design
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  /* Current Year */
  year: string = new Date().getFullYear().toString()

  // User object, inputted from app.component
  currentUser: User

  /* Section for unsubscribing from Subscriptions to avoid
  memory leaks */
  subscription: Subscription = new Subscription()

    /**
   * Constructor for the Main Menu nav layout
   * @param changeDetectorRef Used to see if screen size has changed
   * @param media Used to get media query
   * @param authenticationService Used to get current user
   * @param router Used for Angular routing
   */
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)')
    this._mobileQueryListener = () => changeDetectorRef.detectChanges()
    this.mobileQuery.addListener(this._mobileQueryListener)
    this.currentUser = this.authenticationService.currentUserVal
  }

  ngOnInit() { }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener)
  }

  /**
   * Function called when user pressed log out button. Calls the deauth function, update the user object
   * then route the user to the main page
   */
  logout() : void {
    this.authenticationService.logout()
    this.router.navigate(['/login'])
  }
}

// https://stackblitz.com/angular/enmqvbkjxrr?file=app%2Fsidenav-responsive-example.css
