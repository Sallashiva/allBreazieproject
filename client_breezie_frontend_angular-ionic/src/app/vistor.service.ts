import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VisitorResponse } from './visitor-logout/visitor-response';


@Injectable({
  providedIn: 'root'
})
export class VistorService {

  constructor(private http:HttpClient) { }

  private DataSource = new BehaviorSubject('Data is Empty');
  serviceData = this.DataSource.asObservable();

  setData(data :any){
    this.DataSource.next(data);
  }

  visitorData(data) {
    return this.http.post< {
      error: boolean;
      message: string;
      response: string;
      visitorData:VisitorResponse
    }>(`${environment.baseUrl}/visitor/add-visitor-in-device`,data);
  }

  getVisitor(id) {
    return this.http.get< {
      error: boolean;
      message: string;
      response: VisitorResponse;
      visitorData:VisitorResponse
    }>(`${environment.baseUrl}/visitor/get-visitor-for-device/${id}`,);
  }

  getWelcomScreen(){
    return this.http.get<{
      error: boolean,
      message: string,
      settings:any
    }>(`${environment.baseUrl}/setting/get-all-settings`)
  }
    getAllVisitors(){
      return this.http.get<{
        error: boolean,
        message: string,
        visitorArray: VisitorResponse[]
      }>(`${environment.baseUrl}/visitor/get-all-ionic-visitor`)
  }

  signOutVisitors(id,date) {
    return this.http.put<{
      error: boolean,
      message: string,
      response: VisitorResponse
    }>(`${environment.baseUrl}/visitor/add-logout/${id}`,date)
  }


}
