import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgreementService {

  constructor(private http: HttpClient) { }

  getAgreement() {
    return this.http.get<{
      error: boolean,
      message: string,
      response
    }>(`${environment.baseUrl}/agreement/get-agreement`)
  }

  addNewAgreement(formData) {
    return this.http.post<{
      error: boolean,
      message: string,
      response
    }>(`${environment.baseUrl}/agreement/add-new-agreement/`,formData)
  }

  editAgreement(id:string,formData) {
    return this.http.put<{
      error: boolean,
      message: string,
      response
    }>(`${environment.baseUrl}/agreement/edit-agreement/${id}`,formData)
  }
}
