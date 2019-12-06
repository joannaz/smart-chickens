/**
 * Component for individual cards to display sensor data
 * from the Chicken Coop.
 * 
 * @author Joanna Zhang
 * @version 19-01-2019
 */
import { Component, Input, OnDestroy } from '@angular/core';
import { Card } from '../../models/data';
import { UpdateService } from '../../services/update.service'
import { Subscription, timer } from 'rxjs'

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less']
})
export class CardComponent implements OnDestroy {
  // Data input passed in from parent - CardSectionComponent
  @Input() data: Card
  /* Display or not display last updated */
  @Input() noTime: Boolean
  live = true

  updating: boolean = false

  /* Section for unsubscribing from Subscriptions to avoid
  memory leaks */
  subscription: Subscription = new Subscription()

  constructor(private updateService: UpdateService ){}

  onClick(input: string){
    let sensor = input.split(" ")[0].toLowerCase();
    this.updating = true
    this.subscription.add(this.updateService.updateSensor(sensor).subscribe(res => {
      this.data.value = res.data
      this.data.time = new Date()
      this.updating = false
    }))
  }

  ngOnDestroy() : void {
    this.subscription.unsubscribe();
  }
}
