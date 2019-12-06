/**
 * Child component for code editing
 * 
 * @author Joanna Zhang
 * @version 21-02-2019
 */

import { Component, Input, Output, EventEmitter, Inject, OnDestroy, OnInit } from '@angular/core';
import { CodeService } from '../../../services/code.service'
import { SourceCode } from '../../../models/code';
import { TitleService } from '../../../services/title.service'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Subscription } from 'rxjs';

// Interface for the dialog popup
export interface DialogData {
  type: number;
  delete: boolean;
  name: string
}

@Component({
  selector: 'code-editor',
  templateUrl: './codeEditor.component.html',
  styleUrls: ['./codeEditor.component.less']
})
export class CodeEditorComponent implements OnInit, OnDestroy {
  /* Code object */
  _code: SourceCode

  /* Any field change to set save button to active */
  fieldChange = false
  /* If saving is loading*/
  loading: boolean = false
  /* If code has been successfully sent to the hub */
  successSentHub: boolean = false

  /* On code change, clear compile error message */
  @Input()
  set code(code: SourceCode) {
    this._code = code
    this.compileErr = false
  }

  /* Index of code being edited in the parent array */
  @Input() index: number
  /* Whether parent only update data locally */
  @Output() updateLocal = new EventEmitter<number>();
  /* Whether parent should refresh data from API*/
  @Output() updateTotal = new EventEmitter<number>();

  /* Used to display compile error */
  compileErr: boolean
  compileErrMsg: string

  /* Section for unsubscribing from Subscriptions to avoid
  memory leaks */
  subscription: Subscription = new Subscription()

  /**
   * Constructor for the child code component
   * @param codeService Used to update/delete/add code
   * @param titleService Used to change the title
   * @param dialog Used to display pop up confirming user actions
   */
  constructor(
    private codeService: CodeService,
    private titleService: TitleService,
    public dialog: MatDialog
  ) { }

  ngOnInit() { }

  /**
   * Field has changed, so set flag to true
   * to allow save option
   */
  change() : void {
    this.fieldChange = true
  }

  /**
   * Save code
   */
  save() : void {
    // If this is a new code
    if (this._code.id === -1) {
      this.loading = true
      // We want to call the save new code function instead
      this.subscription.add(this.codeService.saveNewCode(this._code).subscribe(x => {
        this.loading = !x,
          this.fieldChange = false
      }))
    }
    else {
      // We are updating an existing code, therefore, we'd want to call updated
      this.loading = true
      this.subscription.add(this.codeService.saveCode(this._code).subscribe(x => {
        this.loading = !x,
          this.fieldChange = false
      }))
    }
  }

  /**
   * We want to send this code to the hub to run
   */
  updateHub() : void {
    /* Display popup asking if user really wants to do this */
    const dialogRef = this.dialog.open(ConfirmCodeDialogComponent,
      {
        data: { type: 2, delete: this._code.is_active, name: this._code.name }
      })

    dialogRef.afterClosed().subscribe(result => {
      // If the user said yes
      if (result) {
        // Save the code
        this.subscription.add(this.codeService.saveCode(this._code).subscribe(x => {
          this.loading = !x
          // If Save successful
          if (x) {
            // Try to see if we can toggle this code to be active by checking if it compiles
            this.subscription.add(this.codeService.toggleActive(this._code).subscribe(toggle => {
              // If it cannot compile, display error message
              if (!toggle.compiles) {
                this.compileErr = true
                this.compileErrMsg = toggle.message
              }
              // Otherwise it is successful and everyone is happy
              else if (toggle.saved && toggle.compiles) {
                this._code.is_active = !this._code.is_active
              } else {
                // Random error - Display default error message
                this.compileErr = true
                this.compileErrMsg = "An error occured."
              }
            }))
          }
        }))
      }
    })
  }

  /**
   * Delete current code
   */
  delete() : void {
    // Asks if user really wants to delete this code
    const dialogRef = this.dialog.open(ConfirmCodeDialogComponent,
      {
        data: { type: 1, name: this._code.name }
      })

    dialogRef.afterClosed().subscribe(result => {
      // If they do really want to delete this code
      if (result) {
        // And this is a new code
        if (this._code.id === -1) {
          // This means this is only contained locally, so just delete it from the parent's array
          // By emitting the index to it
          this.updateLocal.emit(this.index)
        } else {
          // Actually delete from the server
          this.subscription.add(this.codeService.deleteCode(this._code.id).subscribe(x => {
            this.loading = !x,
              // Actually call API to update
              this.updateTotal.emit(this.index)
          }))
        }
      }
    })
  }

  /**
   * Destroy subscriptions to avoid memory leak when component gets destroyed
   */
  ngOnDestroy() : void {
    this.subscription.unsubscribe()
  }
}

@Component({
  selector: 'confirm-code-dialog',
  templateUrl: 'dialog.html',
})
export class ConfirmCodeDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<ConfirmCodeDialogComponent>) { }

}