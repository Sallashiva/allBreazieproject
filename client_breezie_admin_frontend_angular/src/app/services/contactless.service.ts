import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactlessService {

  constructor(private http: HttpClient) { }

  updateContactless(formData) {
    return this.http.put<{
      error: boolean,
      message: string,
      response
    }>(`${environment.baseUrl}/setting/edit-contact-less`,formData)

  }

  getConatactless(){
    return this.http.get<{
      error: boolean,
      message: string,
      settings:any
    }>(`${environment.baseUrl}/setting/get-all-settings`)
  }
}
