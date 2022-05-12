import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { environment } from 'src/environments/environment';
import { DeliveryResponse } from '../models/deliveriesResponse';
@Injectable({
  providedIn: 'root'
})
export class DeliveriesService {

  constructor(private http: HttpClient, private router: Router) {}
  getDeliveries(start, end) {
    return this.http.get < {
      error: boolean,
      message: string,
      delivery: DeliveryResponse[]
    } > (`${environment.baseUrl}/delivery/get-all-delivery/${start}/${end}`)
  }

  addDelivery(data) {
    return this.http.post < {
      error: boolean,
      message: string,
      delivery: DeliveryResponse[]
    } > (`${environment.baseUrl}/delivery/add-delivery`,data)
  }
  addFreeTrial(data){
    return this.http.post < {
      error: boolean,
      message: string
    } > (`${environment.baseUrl}/delivery/free-trial`,data)
  }

  updateDelivery(id:string,delivery ) {
    return this.http. put < {
      error: boolean,
      message: string,
      response
    }>(`${environment.baseUrl}/delivery/edit-delivery/${id}`,delivery)
  }

  collectedTime(id:string,collected){
    return this.http.put <{
      error:boolean,
      message:string,
      response:any
    }> (`${environment.baseUrl}/delivery/mark-collected/${id}`,collected)
  }

  notifyRecepient(id:string,dataId){
    let data1={data:dataId}
    return this.http.post <{
      error:boolean,
      message:string,
    }> (`${environment.baseUrl}/delivery/notify-recepient/${id}`,data1)
  }
}
