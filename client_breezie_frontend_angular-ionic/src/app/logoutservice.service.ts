import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogoutserviceService {

  constructor(private http: HttpClient) { }
  getDeatils(){
    return this.http.get<any>(`${environment.baseUrl}/visitor/remaining-logout`);
  }
  addLogout(id,finalDate) {
    return this.http.put < {
      error: boolean;
      message: string;
    } > (`${environment.baseUrl}/visitor/add-logout/${id}`,finalDate);
  }


}

