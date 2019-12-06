/**
 * Component for displaying the status of the coop door
 * 
 * @author Joanna Zhang
 * @version 22-01-2019
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Door, DoorOptions } from '../../models/door'
import { DoorService } from '../../services/door.service'
import { SystemService } from '../../services/system.service'
import { AuthenticationService } from '../../services/authentication.service'
import { Location } from '../../models/location'
import { Card } from '../../models/data'
import { Subscription, timer } from 'rxjs'
import { switchMap } from 'rxjs/operators';

declare var SunCalc: any;

@Component({
  selector: 'door-display',
  templateUrl: './doorDisplay.component.html',
  styleUrls: ['./doorDisplay.component.less']
})
export class DoorDisplayComponent implements OnInit, OnDestroy {
  door: Door

  doorOptions: DoorOptions = {
    close_time: 0,
    open_time: 0
  }

  location: Location
  // Sunrise + sunset times for today
  sunrise: Card = {
    name: "Sunrise",
    value: "",
    time: new Date()
  }

  sunset: Card = {
    name: "Sunset",
    value: "",
    time: new Date()
  }

  open: Card = {
    name: "Door Open Time",
    value: "",
    time: new Date()
  }

  close: Card = {
    name: "Door Close Time",
    value: "",
    time: new Date()
  }

  // Used in the view to change day and night
  night: boolean = false
  // Used to display the status in a human readable format in the view
  doorStatus: string
  // Used to calculate if it is night time
  sunsetDate: Date
  // Used in the view to display a door error
  error: boolean = false
  // Current Date
  date: Date = new Date()
  doorUpdated: string

  doorLoading: boolean = false
  doorSuccess: boolean = false
  doorErr: boolean = false
  doorErrMsg: string
  // Can user control door
  doorControl: boolean = false

  reason: string = "due to automation"

  /* Section for unsubscribing from Subscriptions to avoid
  memory leaks */
  subscription: Subscription = new Subscription()

  /**
   * Constructor for Door Display Component
   * Injects:
   * @param doorService Used to get door config
   * @param systemService Used to get location
   */
  constructor(private doorService: DoorService,
    private systemService: SystemService,
    private authService: AuthenticationService) { }

  /**
   * On init, calculate the sunrise and sunset dates for the client's location and
   * calculates state of door
   */
  ngOnInit(): void {
    // Get the door status and options from the API
    this.subscription.add(this.doorService.getDoorOptions().subscribe(val => {
      this.doorOptions.close_time = val.close_time,
        this.doorOptions.open_time = val.open_time,
        // Format the open and close times of the door
        this.open.value = this.getTime(this.doorOptions.open_time),
        this.close.value = this.getTime(this.doorOptions.close_time)
    }))

    // Get the sunset sunrise hours
    this.subscription.add(this.systemService.getLocation().subscribe(x => {
      this.location = x
      let times = SunCalc.getTimes(this.date, this.location.lat, this.location.long)
      if (times.sunrise.getMinutes() >= 10) {
        this.sunrise.value = "" + times.sunrise.getHours() + ":" + times.sunrise.getMinutes()
      } else {
        this.sunrise.value = "" + times.sunrise.getHours() + ":0" + times.sunrise.getMinutes()
      }

      if (times.sunset.getMinutes() >= 10) {
        this.sunset.value = "" + times.sunset.getHours() + ":" + times.sunset.getMinutes()
      } else {
        this.sunset.value = "" + times.sunset.getHours() + ":0" + times.sunset.getMinutes()
      }
      this.sunsetDate = times.sunset
    }))

    this.doorControl = this.authService.currentUserVal.userObj.door_control

    // Update door status every 30s
    this.subscription = timer(0, 10000000).pipe(
      switchMap(() => this.doorService.getDoorStatus())).subscribe(val => {
        this.door = val
        this.doorStatus = this.getPrettyStatus(val.value)
        this.reason = val.reason
        let fakeDate = new Date('2019-03-17T18:30:10')
        this.doorUpdated = this.getPrettyDoorTime(fakeDate)
      })
  }

  /**
   * Pretty print door time
   * @param date date to display
   * @returns the prettified door time
   */
  getPrettyDoorTime(date: Date): string {
    let d = new Date(date)
    let x = d.toDateString().slice(0, 11).split(" ")
    return "on " + x[0] + " " + x[2] + " " + x[1] + " " + " at " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  }

  /**
   * Returns pretty door status
   * @param val the value from the db
   * @returns the prettified string
   */
  getPrettyStatus(val: string): string {
    switch (val) {
      case "door_moving":
        return "Door Moving"
      case "open":
        return "Open"
      case "closed":
        return "Closed"
      case "hub_error":
        return "Hub Error"
      default:
        return "Door Error"
    }
  }

  /**
   * Prettifies the current time.
   * @argument minutes after midnight
   * @returns String displaying the hours and minutes formatted in 24h clock
   */
  getTime(time): string {
    let sec_num = parseInt(time, 10)
    let hours = Math.floor(sec_num / 3600)
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60)
    if (minutes < 10) {
      return hours + ':0' + minutes
    }
    return hours + ':' + minutes
  }


  /**
   * Open door
   */
  openDoor(): void {
    this.doorLoading = true
    this.doorService.openDoor().subscribe(res => {
      this.doorLoading = false
      this.doorSuccess = true
      setTimeout(() => {
        this.doorSuccess = false
      }, 5000)
      this.updateData()
    })
  }

  /**
   * Close door
   */
  closeDoor(): void {
    this.doorLoading = true
    this.doorService.closeDoor().subscribe(res => {
      this.doorLoading = false
      if (res.success) {
        this.doorSuccess = true

        setTimeout(() => {
          this.doorSuccess = false
        }, 5000)
      } else {
        this.doorErr = true
        this.doorErrMsg = res.message
      }
    })
  }

  /**
   * One time update data
   */
  updateData(): void {
    this.subscription.add(this.doorService.getDoorStatus().subscribe(val => {
      this.door = val
      this.doorStatus = this.getPrettyStatus(val.value)
      this.doorUpdated = this.getPrettyDoorTime(val.date)
    }))
  }

  /**
   * Unsubscribe to avoid memory leaks
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}

// https://stackoverflow.com/questions/48761882/in-angular-5-how-can-i-import-npm-modules-with-no-types
// https://github.com/mourner/suncalc