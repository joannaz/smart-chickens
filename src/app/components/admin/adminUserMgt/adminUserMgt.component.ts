/**
 * Console to manage signed up users
 * Uses ngx-datatable library
 * 
 * @author Joanna Zhang
 * @version 12-02-2019
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../../services/admin.service'
import { UserObj } from '../../../models/user'
import { TitleService } from '../../../services/title.service'
import { Subscription } from 'rxjs';


@Component({
  selector: 'admin-user-management',
  templateUrl: './adminUserMgt.component.html',
  styleUrls: ['./adminUserMgt.component.less']
})
export class AdminUserManagementComponent implements OnInit, OnDestroy {
  /* Used by the library to know which row we're displaying to edit */
  editing = {}

  /* An arry of user accounts */
  rows: UserObj[]

  /* Section for unsubscribing from Subscriptions to avoid
  memory leaks */
  subscription: Subscription = new Subscription()

  /**
   * Constructor for the User Management Page
   * @param adminService Used to get the user accounts
   * @param titleService Used to change the title next to the burger icon
   */
  constructor(private adminService: AdminService,
              private titleService: TitleService
  ) {  }

  /**
   * When this component is created, get the array of user accounts
   * And update the title
   */
  ngOnInit() : void {
    this.subscription.add(this.adminService.getAll().subscribe(x => this.rows = x))
    this.subscription.add(this.titleService.updateData("User Management"))
  }

  /**
   * 
   * @param event The event happened - contains the new value
   * @param cell column name of the value being changed (e.g. name, username)
   * @param rowIndex The row that is being updated
   */
  updateValue(event, cell, rowIndex) : void {
    // Get the username to use as the key
    let username = this.rows[rowIndex].username
    this.subscription.add(this.adminService.updateUser(username, cell, event.target.value).subscribe(res => {
      // Display not editing once saved
      this.editing[rowIndex + '-' + cell] = false
      this.rows[rowIndex][cell] = event.target.value
      // ... = rest operator
      // Used for array construction and destructuring
      // TODO EXPLAIN
      this.rows = [...this.rows]
    }))
  }


  /**
   * Confirms if the sys admin wants to delete this user.
   * Then calls to backend to delete it. 
   * @param username The username to delete
   */
  delete(username) : void {
    if (confirm('Are you sure you want to delete '+ username)) {
      this.subscription.add(this.adminService.deleteUser(username).subscribe(res => {
        this.subscription.add(this.adminService.getAll().subscribe(x => this.rows = x))
      }))
    }
  }

  ngOnDestroy() : void {
    this.subscription.unsubscribe()
  }

}
