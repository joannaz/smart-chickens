/**
 * Parent component for settings
 * 
 * @author Joanna Zhang
 * @version 19-02-2019
 */

import { Component, OnInit, Inject, OnDestroy } from '@angular/core'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { UserService } from '../../services/user.service'
import { AuthenticationService } from '../../services/authentication.service'
import { Emails } from '../../models/user'
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment'
import { Subscription } from 'rxjs'

const apiUrl = environment.apiUrl + "/users/uploadUserPic"

export interface DialogData {
  emailString: string;
}

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})

export class SettingsComponent implements OnInit, OnDestroy {
  /* General Fields */
  username = this.authenticationService.currentUserVal.userObj.username

  /* Fields for Email Management*/
  emails: Emails
  showEmailInput: Boolean = false
  email: string

  /* Fields for Password Reset*/
  password: string
  steps: number = 1
  newPassword: string
  confirmPassword: string
  passwordErr: boolean = false
  success: boolean

  /* Fields for Image Upload*/
  defaultPic = this.authenticationService.currentUserVal.userObj.default_pic
  userUrl = environment.apiUrl + "/uploads/" + this.username
  public uploader: FileUploader = new FileUploader({ 
    url: apiUrl, 
    autoUpload: true, 
    authToken: "Bearer " + this.authenticationService.currentUserVal.token,
    allowedFileType: ['image']
  })

  public hasBaseDropZoneOver: boolean = false
  currToken: string

  /* Section for unsubscribing from Subscriptions to avoid
  memory leaks */
  subscription: Subscription = new Subscription()

  /**
   * Constructor for Settings Component
   * @param userService Used for emails
   * @param authenticationService Used for passwords
   * @param dialog Used for confirming
   */
  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog
  ) { }

  /**
   * Get the list of emails
   */
  ngOnInit(): void {
    this.subscription.add(this.userService.getEmail(this.username).subscribe(x => this.emails = x))
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false }
    this.uploader.onSuccessItem = () => {
      this.subscription.add(this.authenticationService.refreshUser().subscribe(x => {
        window.location.reload();
      }))
    }
  }

  /**
   * Add email button pressed, then can display input field
   */
  addEmail(): void {
    this.showEmailInput = true;
  }

  /**
   * Save email has been pressed - call the endpoint
   * to save email
   */
  saveEmail(): void {
    if (this.email && this.email.length) {
      this.subscription.add(this.userService.addEmail(this.email, this.username).subscribe(x => {
        this.showEmailInput = false
        this.userService.getEmail(this.username).subscribe(x => this.emails = x)
        // Clear email
        this.email = ""
      }))
    }
  }

  /**
   * Delete email
   * @param email Email to delete
   */
  deleteEmail(email): void {
    // Ask user to confirm deletion
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: { emailString: email }
      })

    dialogRef.afterClosed().subscribe(result => {
      // if user confirms
      if (result) {
        this.subscription.add(this.userService.deleteEmail(email).subscribe(y => {
          this.subscription.add(this.userService.getEmail(this.username).subscribe(x => this.emails = x))
        }))
      }
    })
  }

  /**
   * User enters password to change new password - checks if current
   * password authenticated
   */
  checkPassword(): void {
    this.subscription.add(this.authenticationService.login(this.username, this.password, false).subscribe(user => {
      if (user) {
        // Go to next step
        this.steps = 2
      }
    }))
  }

  /**
   * Change password
   */
  changePassword(): void {
    // Check if both passwords match
    if (this.newPassword != this.confirmPassword) {
      this.passwordErr = true
      return
    } else {
      this.subscription.add(this.userService.changePassword(this.username, this.password, this.newPassword).subscribe(x => {
        this.success = x
        this.steps = 3
        // display pw successfully changed for 5s
        setTimeout(() => {
          this.steps = 1
          this.reset()
        }, 5000)
      }))
    }
  }

  /**
   * After resetting pws, reset all fields
   */
  reset(): void {
    this.password = ""
    this.newPassword = ""
    this.confirmPassword = ""
  }

  /**
   * Change the colour of the file drop zone when file
   * hovered over
   * @param e event
   */
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  /**
   * HELPER FUNCTIONS
   */

  keyDownFunctionEmail(event): void {
    if (event.keyCode == 13) {
      this.addEmail()
    }
  }

  keyDownFunctionPassword(event): void {
    if (event.keyCode == 13) {
      this.checkPassword()
    }
  }

  keyDownFunctionPasswordSave(event): void {
    if (event.keyCode == 13) {
      this.changePassword()
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'dialog.html',
})
export class ConfirmDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>) { }

}