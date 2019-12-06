/**
 * Parent component for settings
 * Displays a map to change location - LeafletJS
 * And uses ngx-material-timepicker to allow ease of
 * picking a time.
 * 
 * @author Joanna Zhang
 * @version 19-01-2019
 */

import { Component, OnDestroy, OnInit } from '@angular/core'
import { SystemService } from '../../../services/system.service'
import { DoorService } from '../../../services/door.service'
import { AuthenticationService } from '../../../services/authentication.service'
import { UserService } from '../../../services/user.service'
import { Location } from '../../../models/location'
import { TitleService } from '../../../services/title.service'
import { latLng, tileLayer, marker, icon, Layer } from 'leaflet'
import { Subscription } from 'rxjs'

@Component({
  selector: 'admin-settings',
  templateUrl: './adminSettings.component.html',
  styleUrls: ['./adminSettings.component.less']
})
export class AdminSettingsComponent implements OnInit, OnDestroy {
  /* Map Options */
  options = {
    layers: [
      tileLayer('https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoiam9hbm5heiIsImEiOiJjam9ybmMzZngwZzViM3FrZmswYjRhanR1In0._pTdM01sisC8Bd-JTbzYWQ', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    zoom: 12,
    center: latLng([51.156570, -0.226150])
  }
  /* Default location */
  location: Location = {
    lat: '0',
    long: '0'
  }

  /* List of markers for map */
  markers: Layer[] = []

  /* Detects if the marker has changed and allows the
  save button to be pressed */
  fieldChange = false

  /* Display a spinner if it is currently waiting
  for an API response */
  loading: boolean = false

  /* Time Options */
  open: string
  close: string
  /* Detects if the time has changed and allows the
  save button to be pressed */
  tFieldChange: boolean = false
  /* Loading for time */
  tLoading: boolean = false

  /* Hub URL */
  hubUrl: string

  /* System password reset */
  password: string
  steps: number = 1
  newPassword: string
  confirmPassword: string
  passwordErr: boolean = false
  success: boolean

  /* Section for unsubscribing from Subscriptions to avoid
  memory leaks */
  subscription: Subscription = new Subscription()

  /**
   * Constructor for the Main Admin Settings Page
   * @param systemService Used to get the current user stored location from the database
   * @param titleService Used to change the title next to the burger icon on the left
   * @param doorService Used to get the current door open / clsoe times from the database
   * @param authService Used to auth user when changing password
   * @param userService Used to change password
   */
  constructor(
    private systemService: SystemService,
    private titleService: TitleService,
    private doorService: DoorService,
    private authService: AuthenticationService,
    private userService: UserService
  ) { }

  /**
   * When this component is created, initialise the variables. 
   */
  ngOnInit(): void {
    /* Get the open and close time of thhe door and assign it to this open / close as a string
    as ngx-material-timepicker only uses a string as input */
    this.subscription.add(this.doorService.getDoorOptions().subscribe(x => {
      this.open = this.seconds_to_string(x.open_time),
        this.close = this.seconds_to_string(x.close_time)
    }))

    /* Get the lat and long and add it to the map as a marker */
    this.subscription.add(this.systemService.getLocation().subscribe(x => {
      this.location.lat = x.lat
      this.location.long = x.long
      this.addMarker(parseFloat(this.location.lat), parseFloat(this.location.long))
    }))

    this.subscription.add(this.systemService.getHubUrl().subscribe(url => {
      this.hubUrl = url.url
    }))

    /* Update the title of the parent component */
    this.subscription.add(this.titleService.updateData("System Settings"))
  }

  /**
   * Helper function to turn seconds after midnight into 
   * an hh:ss formatted string
   * @param time seconds after midnight
   * @returns stringified time
   */
  seconds_to_string(time): string {
    if(!time){
      return ""
    }
    let sec_num = parseInt(time, 10)
    let hours = Math.floor(sec_num / 3600)
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60)
    return hours + ':' + minutes
  }

  /**
   * Removes the current marker on the map and
   * adds the new marker
   * @param lat The latitude to add the marker to
   * @param long The longitude to add the marker to
   */
  addMarker(lat, long): void {
    this.markers.pop()
    let layer = marker([lat, long], {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/img/marker-icon.png',
        shadowUrl: 'assets/img/marker-shadow.png'
      })
    })
    this.markers.push(layer)
  }

  /**
   * On map click, this will move the marker
   * And set the new lat and long, so the user
   * can save if neccessary
   * @param name name of event (click)
   * @param e event details
   */
  moveMarker(name, e): void {
    this.fieldChange = true
    this.addMarker(e.latlng.lat, e.latlng.lng)
    this.location.lat = e.latlng.lat
    this.location.long = e.latlng.lng
  }


  /**
   * Calls when the user changes the time.
   * This allows the save button to be pressed.
   * @param e event
   */
  changeTime(e): void {
    this.tFieldChange = true
  }

  /**
   * Set field change to true when keypress on url
   */
  changeUrl(): void {
    this.tFieldChange = true
  }



  /**
   * Saves the time for the door to open
   * and close
   */
  saveTime(): void {
    this.tLoading = true
    // Convert the string back to seconds after midnight
    let openTime = this.open.split(":")
    let closeTime = this.close.split(":")
    let numOpenTime = parseInt(openTime[0]) * 60 * 60 + parseInt(openTime[1]) * 60
    let numCloseTime = parseInt(closeTime[0]) * 60 * 60 + parseInt(closeTime[1]) * 60
    // Update it
    this.subscription.add(this.doorService.updateDoorOptions(numOpenTime, numCloseTime)
      .subscribe(x => {
        this.subscription.add(this.systemService.updateHubUrl(this.hubUrl).subscribe(y => {
          this.tLoading = !x,
            this.tFieldChange = false
        }))

      }))
  }

  /**
   * Saves the location of the chicken coop
   */
  save(): void {
    this.loading = true;
    this.subscription.add(this.systemService.saveLocation(this.location.lat, this.location.long).subscribe(x => {
      this.loading = !x
      this.fieldChange = false
    }))
  }


  /**
  * User enters password to change new password - checks if current
  * password authenticated
  */
  checkPassword(): void {
    this.subscription.add(this.authService.login('system', this.password, false).subscribe(user => {
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
      this.subscription.add(this.userService.changePassword('system', this.password, this.newPassword).subscribe(x => {
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
   * Reset time to turn automation off
   */
  clearTime(): void {
    this.subscription.add(this.doorService.cancelAutomation().subscribe(res => {
      if (res) {
        this.open = ""
        this.close = ""
      }
    }))
  }

  /**
   * Destroy our subscriptions when this component is destroyed to
   * avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}