/**
 * Component for individual icons of the cards
 * 
 * @author Joanna Zhang
 * @version 19-01-2019
 */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'card-icon',
  templateUrl: './cardIcon.component.html',
  styleUrls: ['./cardIcon.component.less']
})
export class CardIconComponent {
  // Type of icon. Input from parent component - card
  @Input() type: String;
  
}
