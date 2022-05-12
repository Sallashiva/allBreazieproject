import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http:HttpClient) { }
  contactDetails(data: any) {
    return this.http.post<{
      error: boolean,
      message: string
    }>(`${environment.baseUrl}/website/send-contact-mail`,data)
  }
}
