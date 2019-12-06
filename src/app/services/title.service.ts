/**
 * Service for titles
 * 
 * @author Joanna Zhang
 * @version 10-02-2019
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
 
@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private dataObs$ = new Subject<string>();

  getData() {
      return this.dataObs$.asObservable();
  }

  updateData(data: string) {
      this.dataObs$.next(data);
  }
}