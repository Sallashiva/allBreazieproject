import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingEmployeesService {

  constructor(private http:HttpClient) { }


  updateEmployeeSetting( update) {
    return this.http.put < {
      error: boolean,
      message: string,
      response
    } > (`${environment.baseUrl}/setting/edit-employee-setting`,update )
  }

}
