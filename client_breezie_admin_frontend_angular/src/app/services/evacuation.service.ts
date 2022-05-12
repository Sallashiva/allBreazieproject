import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { VisitorResponse } from '../models/visitor';

@Injectable({
  providedIn: 'root'
})
export class EvacuationService {
  
  constructor(
    private http: HttpClient
  ) { }

  getAllEvacuationData(){
    return this.http.get<{
      error: boolean,
      message: string,
      response: VisitorResponse[]
    }>(`${environment.baseUrl}/visitor/get-evacuation-data`)

  }
  
}
