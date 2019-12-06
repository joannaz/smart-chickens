/**
 * Service to manage code snippets
 * 
 * @author Joanna Zhang
 * @version 19-01-2019
 */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { SourceCode, ToggleActive } from '../models/code'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CodeService {
  env = environment

  /**
   * Constructor for this service
   * @param http HTTP Client for API requests
   */
  constructor(private http: HttpClient) { }

  /**
   * Get the current list of source codes
   * @returns Observable of a Source Code Array
   */
  getSourceCode(): Observable<SourceCode[]> {
    return this.http.get<SourceCode[]>(`${this.env.apiUrl}/code/getSourceCode`);
  }

  /**
   * Update source code
   * @param sourceCode Source code to update
   * @returns Observable of true if successfully updated
   */
  saveCode(sourceCode: SourceCode) : Observable<Boolean> {
    return this.http.post<Boolean>(`${this.env.apiUrl}/code/updateSourceCode`, { sourceCode });
  }

/**
   * Try and send code to the hub or remove from hub
   * @param sourceCode Source code to toggle and check compilation
   * @returns Observable of ToggleActive
   */
  toggleActive(code: SourceCode) {
    return this.http.post<ToggleActive>(`${this.env.apiUrl}/code/toggleActiveCode`, { code });
  }

  /**
   * Delete code snippet
   * @param id ID of the code to be deleted
   * @returns Observable of true if successfully deleted
   */
  deleteCode(id: number) : Observable<Boolean> {
    return this.http.delete<any>(`${this.env.apiUrl}/code/deleteCode/${id}`);
  }

  /**
   * Save and add new code to DB
   * @param code The new code to be added
   * @returns true if added
   */
  saveNewCode(code: SourceCode) : Observable<Boolean> {
    return this.http.post<Boolean>(`${this.env.apiUrl}/code/saveNewCode`, { code });
  }
}