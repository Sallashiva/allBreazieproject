import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingVisitorFieldsService {

  constructor(private http:HttpClient) { }

  updateVisitorFields(data:any) {
    return this.http.put < {
      error: boolean,
      message: string,
      response
    } > (`${environment.baseUrl}/setting/edit-visitor-field`,data )
  }

}
