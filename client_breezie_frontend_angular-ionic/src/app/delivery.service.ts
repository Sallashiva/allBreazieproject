import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  constructor(private http: HttpClient,) { }

  addDelivery(data) {
    return this.http.post < {
      error: boolean,
      message: string,
      delivery,
    } > (`${environment.baseUrl}/delivery/add-delivery`,data)
  }


  addGeneralDelivery(data) {
    return this.http.post < {
      error: boolean,
      message: string,
      delivery,
    } > (`${environment.baseUrl}/delivery/addGeneralDelivery`,data)
  }
}
