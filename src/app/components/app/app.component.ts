/**
 * App root for the website.
 * 
 * @author Joanna Zhang
 * @version 19-01-2019
 */
import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service'
import { User } from '../../models/user';
import { Role } from '../../models/role'
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  currentUser: User; // Current user object

  // Inject the AuthenticationService into this component. 
  constructor(private authenticationService: AuthenticationService, private router: Router){
   
  }
}
