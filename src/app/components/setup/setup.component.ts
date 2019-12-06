/**
 * First time setup component
 * 
 * @author Joanna Zhang
 * @version 27-02-2019
 */
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { SystemService } from '../../services/system.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { latLng, tileLayer, marker, icon, Layer, Map } from 'leaflet'
import { Location } from '../../models/location'
import { map } from 'rxjs/operators';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.less']
})
export class SetupComponent implements OnInit, AfterViewChecked {
  /* Stepper flags */
  doneStep1 : boolean = false
  doneStep2 : boolean = false
  doneStep3 : boolean = false
  doneStep4 : boolean = false
  doneStep5 : boolean = false

  /* Step 1 */
  hubUrl: string

  /* Step 2 */
  /* Map Options */
  options = {
    layers: [
      tileLayer('https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoiam9hbm5heiIsImEiOiJjam9ybmMzZngwZzViM3FrZmswYjRhanR1In0._pTdM01sisC8Bd-JTbzYWQ', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    zoom: 7,
    center: latLng([51.156570, -0.226150])
  }
  /* Default location */
  location: Location = {
    lat: '0',
    long: '0'
  }
  /* List of markers for map */
  markers: Layer[] = []
  map: Map

  /* Step 3 */
  password: string
  confirmPassword: string
  err: string

  // Inject the AuthenticationService into this component. 
  constructor(private systemService: SystemService, private router: Router) { }

  ngOnInit() {

  }

  /**
   * Refresh map size when view is changed
   */
  ngAfterViewChecked() : void {
    this.map.invalidateSize()
  }

  /**
   * When map loads, save the map to have access to it. Then we are able to call
   * invalidateSize to refresh the size
   * @param map 
   */
  onMapReady(map: Map)  : void {
    // Do stuff with map
    this.map = map
  }

  /**
   * User can proceed to next step
   */
  validateStepOne() : void {
      this.doneStep1 = true
      return
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
    this.doneStep2 = true
  }

  /**
   * Checks if both system passwords match
   * @param stepper the stepper to move to next step if true
   */
  validateSystemPassword(stepper: MatStepper) : void{
    if(this.password && this.confirmPassword){
      if((this.password === this.confirmPassword) && this.password.length > 8){
        this.err = ""
        this.doneStep3 = true
        setTimeout( () => { stepper.next() }, 10 )
        
      } else {
        this.err = "Both passwords must match and be longer than 8 characters"
      }
    }
  }

  /**
   * On map click, this will move the marker
   * And set the new lat and long, so the user
   * can save if neccessary
   * @param name name of event (click)
   * @param e event details
   */
  moveMarker(name, e): void {
    this.addMarker(e.latlng.lat, e.latlng.lng)
    this.location.lat = e.latlng.lat
    this.location.long = e.latlng.lng
  }

  finish() {
    this.systemService.setLocation(this.location.lat, this.location.long).subscribe(x => {
      if(x){
        this.systemService.updateSystemPassword(this.password).subscribe(y => {
          console.log(y)
          if(y){
            this.systemService.updateHubUrlSetup(this.hubUrl).subscribe(z => {
              this.systemService.finishFirstTimeSetup().subscribe(y => {
                this.router.navigate(['/login'])
              })
            })
          }
        })
      }
    })
    
  }
}
