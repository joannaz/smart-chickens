/**
 * Parent component to get data of from all the sensors
 * and pass this data to the children to display. 
 * 
 * @author Joanna Zhang
 * @version 19-01-2019
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Data, Card } from '../../models/data';
import { DataService } from '../../services/data.service'
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'card-section',
  templateUrl: './cardSection.component.html',
  styleUrls: ['./cardSection.component.less']
})
export class CardSectionComponent implements OnInit, OnDestroy {
  list: Data
  subscription: Subscription;


  constructor(private dataService: DataService){}

  ngOnInit() : void {
    // Refresh data every 30s
    this.subscription = timer(0,30000).pipe(
      switchMap(() => this.dataService.getcurrentData())).subscribe(result => this.list = result)


  }

  ngOnDestroy() : void {
    this.subscription.unsubscribe()
  }
}
