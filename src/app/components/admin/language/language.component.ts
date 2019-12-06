/**
 * Parent component for code snippets
 * 
 * @author Joanna Zhang
 * @version 21-02-2019
 */

import { Component, OnInit, OnDestroy } from '@angular/core'
import { CodeService } from '../../../services/code.service'
import { SourceCode } from '../../../models/code'
import { first } from 'rxjs/operators'
import { TitleService } from '../../../services/title.service'
import { FormControl } from '@angular/forms'
import { Subscription } from 'rxjs'


@Component({
  selector: 'language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.less']
})
export class LanguageComponent implements OnInit, OnDestroy {

  /* List of code snippets got from API */
  codes: SourceCode[] = []

  /* Default code if none exists */
  code: SourceCode = {
    code: "",
    date_created: new Date,
    id: -1,
    is_active: false,
    last_modified: new Date,
    name: "Test Code"
  }

  /* Index number in the array which code we're looking at */
  index: number = 0

  /* Which index we have selected */
  selected = new FormControl(0)

    /* Section for unsubscribing from Subscriptions to avoid
  memory leaks */
  subscription: Subscription = new Subscription()

  /**
   * Constructor for the Parent Code Component Page
   * @param codeService Used to get the list of code snippets
   * @param titleService Used to change the title of the parent
   */
  constructor(
    private codeService: CodeService,
    private titleService: TitleService
  ) { }

  /**
   * On component creation Get the list of code snippets
   */
  ngOnInit() : void {
    this.subscription.add(this.codeService.getSourceCode().pipe(first()).subscribe(x => {
      if (x.length > 1) {
        this.codes = x
        this.code = x[0]
      } else {
        // Empty list - just add the default one on.
        this.codes.push(this.code)
      }
    }))
    // Update title
    this.titleService.updateData("Programmable Interface")
  }

  /**
   * Add new code snippet 
   */
  addTab() : void {
    this.codes.push({
      code: "",
      date_created: new Date(),
      id: -1,
      is_active: false,
      last_modified: new Date(),
      name: "New Code"
    });

    // Auto select this tab
    this.selected.setValue(this.codes.length - 1);

  }

  /**
   * Delete the tab
   * @param index the index in the array to delete
   */
  removeTab(index: number) : void {
    this.codes.splice(index, 1)
  }

  /**
   * Refresh the datam then select first one
   * @param index 
   */
  reload(index: number) : void {
    this.subscription.add(this.codeService.getSourceCode().pipe(first()).subscribe(x => {
      this.codes = x
      this.code = x[0]
      this.index = 0
    }))
  }

  /**
   * When tab is changed, change which code is being displayed
   * @param $event The event
   */
  changeCode($event) : void {
    this.code = this.codes[$event.index]
    this.index = $event.index
  }

  /**
   * Unsubscribe to avoid memory leak
   */
  ngOnDestroy() :void {
    this.subscription.unsubscribe()
  }
}
