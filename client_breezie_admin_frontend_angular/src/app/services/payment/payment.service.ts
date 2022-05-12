import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private http: HttpClient
  ) { }
  
  getCurrency(){
    return this.http.get<{
      date,
      base,
      rates
    }>(`https://api.currencyfreaks.com/latest?apikey=42d63e9242a944fea33c9b2de6801539`)
  }
  createPayment(data){
    return this.http.post<{
      error: boolean,
      message: string,
      response,
      order,
      id,amount,
      key
      payload
    }>(`${environment.baseUrl}/payment/create-order`,data)
  }

  verifyPayment(data){
    return this.http.post<{
      error: boolean,
      message: string,
    }>(`${environment.baseUrl}/payment/verification`,data)
  }
}
