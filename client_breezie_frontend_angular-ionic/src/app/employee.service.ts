import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmployeeSignOutResponse } from './employees/employeeResponse';
import { EmployeeResponse } from './register/RegisterModel/employeesResponse';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  private DataSource = new BehaviorSubject('Data is Empty');
  serviceData = this.DataSource.asObservable();

  setData(data :any){
    this.DataSource.next(data);
  }

  getEmployee() {
    return this.http.get<{
      error: boolean,
      message: string,
      employeeData
    }>(`${environment.baseUrl}/employee/get-all-employee`)

  }

  getEmploye(id) {
    return this.http.get<{
      error: boolean,
      message: string,
      employeeData
    }>(`${environment.baseUrl}/employee/get-employee/${id}`)
  }
  getWelcomScreen(){
    return this.http.get<{
      error: boolean,
      message: string,
      settings:any
    }>(`${environment.baseUrl}/setting/get-all-settings`)
  }

  signOutEmployee(data){
    return this.http.post<{
      error:Boolean,
      message:string,
      response:EmployeeSignOutResponse

    }>(`${environment.baseUrl}/employee/change-status`,data)
  }
}
