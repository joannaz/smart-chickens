/**
 * Layout for system admin pages
 * 
 * @author Joanna Zhang
 * @version 19-01-2019
 */
import { MediaMatcher } from '@angular/cdk/layout'
import { ChangeDetectorRef, Component, OnDestroy, OnInit, Input, AfterViewChecked } from '@angular/core'
import { User } from '../../../models/user'
import { AuthenticationService } from '../../../services/authentication.service'
import { Router } from "@angular/router"
import { TitleService } from '../../../services/title.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'admin-side-bar',
  templateUrl: './adminSideBar.component.html',
  styleUrls: ['./adminSideBar.component.less']
})
export class AdminSideBarComponent implements OnDestroy, OnInit {

  /* Gets the breakpoints for current viewport size in accordance with Material Design */
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  /* Current Year */
  year: string = new Date().getFullYear().toString()

  /* User object, inputted from app.component */
  currentUser: User

  /* Title of the child page */
  title: string

  /* Section for unsubscribing from Subscriptions to avoid
  memory leaks */
  subscription: Subscription = new Subscription()

  /**
   * Constructor for the Main Menu nav layout
   * @param changeDetectorRef Used to see if screen size has changed
   * @param media Used to get media query
   * @param authenticationService Used to get current user
   * @param router Used for Angular routing
   * @param titleService Used to display title of child page
   */
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authenticationService: AuthenticationService,
    private router: Router,
    private titleService: TitleService

  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)')
    this._mobileQueryListener = () => changeDetectorRef.detectChanges()
    this.mobileQuery.addListener(this._mobileQueryListener)
    this.currentUser = this.authenticationService.currentUserVal
  }

  /**
   * When this component is created, get the title of the child page it is
   * displaying in router-outlet
   */
  ngOnInit() : void {
    this.subscription = this.titleService.getData().subscribe(data => this.title = data)
  }

  /**
   * Destroy our subscriptions when this component is destroyed to
   * avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener)
    this.subscription.unsubscribe()
  }

  /**
   * Function called when user pressed log out button. Calls the deauth function, update the user object
   * then route the user to the main page
   */
  logout() : void {
    this.authenticationService.logout();
    this.router.navigate(['/login'])
  }
}
