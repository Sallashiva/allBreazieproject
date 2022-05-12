import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EmployeeResponse } from '../models/employeeResponse';

@Injectable({
  providedIn: 'root'
})
export class SettingDeliveriesService {

  constructor(private http:HttpClient) { }


 upadeSetup(scanLabel: string,generalsDeliveries: string,deliveriesContacts :[]){
  let data={
    scanLabel:scanLabel,
    generalsDeliveries:generalsDeliveries,
    deliveriesContacts:deliveriesContacts
  }
    return this.http.put<{
      error: boolean,
      message: string,
      response
    }>(`${environment.baseUrl}/setting/edit-delivery-setup`,data)
  }

  getDeliverdEmployee() {
    return this.http.get<{
      error: boolean,
      message: string,
      employeeData: EmployeeResponse[]
    }>(`${environment.baseUrl}/employee/get-deliverd-employee`)

  }

  getCateringEmployee() {
    return this.http.get<{
      error: boolean,
      message: string,
      employeeData: EmployeeResponse[]
    }>(`${environment.baseUrl}/employee/get-catering-employee`)

  }


  getEmployee(id) {
    return this.http.get<{
      error: boolean,
      message: string,
      employeeData
    }>(`${environment.baseUrl}/employee/get-employee/${id}`)
  }

  editEmployee(id) {
    return this.http.put<{
      error: boolean,
      message: string,
      employeeData
    }>(`${environment.baseUrl}/employee/make-deliverd-employee/${id}`,id)
  }


  cateringEditEmployee(id) {
    return this.http.put<{
      error: boolean,
      message: string,
      employeeData
    }>(`${environment.baseUrl}/employee/make-catering-employee/${id}`,id)
  }
  

  getCateringAded(){
    return this.http.get<{
      error: boolean,
      message: string,
      employeeData
    }>(`${environment.baseUrl}/employee/get-catering-added-employee`)
  }



  removeDeliverdEmployee(id){
    return this.http.put<{
      error: boolean,
      message: string,
      employeeData
    }>(`${environment.baseUrl}/employee/remove-deliverd-employee/${id}`,id)
  }

  removeCateringEmployee(id){
    return this.http.put<{
      error: boolean,
      message: string,
      employeeData
    }>(`${environment.baseUrl}/employee/remove-catering-employee/${id}`,id)
  }

  getGeneralDelivery() {
    return this.http.get<{
      error: boolean,
      message: string,
      generalDeliveryData
    }>(`${environment.baseUrl}/delivery/get-general-delivery/`)
  }

  addGeneralDelivery(data) {
    return this.http.post<{
      error: boolean,
      message: string,
      genaral
    }>(`${environment.baseUrl}/delivery/general-delivery/`,data)
  }

  deleteGeneralDelivery(id) {
    return this.http.delete<{
      error: boolean,
      message: string,
    }>(`${environment.baseUrl}/delivery/delete-general-delivery/${id}`)
  }

  getAllCatering(){
    return this.http.get<{
      error: boolean,
      message: string,
      finalResponse
    }>(`${environment.baseUrl}/catering/get-all-data`)
  }

  getAllDelivery(){
    return this.http.get<{
      error: boolean,
      message: string,
      finalResponse
    }>(`${environment.baseUrl}/delivery/get-allDelivery-data`)
  }

}
