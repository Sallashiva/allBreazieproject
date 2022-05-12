import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CafetrriaServiceService {

  constructor(private http:HttpClient) { }

  private DataSource = new BehaviorSubject('Data is Empty');
  serviceData = this.DataSource.asObservable();

  setData(data :any){
    this.DataSource.next(data);
  }

  getBeverages() {
    return this.http.get < {
      error: boolean;
      message: string;
      catering
    } > (`${environment.baseUrl}/catering/get-all-beverage`);
  }
  getFoods() {
    return this.http.get < {
      error: boolean;
      message: string;
      catering
    } > (`${environment.baseUrl}/catering/get-all-foods`);
  }

  postOrderedItems(id:any,data:any) {
    return this.http.post<{
      error: boolean,
      message: string,
    }>(`${environment.baseUrl}/visitor/notify-cafe/${id}`, data)
  }

}
