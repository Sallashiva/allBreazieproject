import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { VisitorResponse } from '../models/visitor';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  constructor(
    private http: HttpClient
  ) { }
  
  http_post(data){
    return this.http.post<{
      error: boolean,
      message: string,
      response,
      order,
      id,amount
      key
      payload
    }>(`${environment.baseUrl}/payment/create-order`,data)
  }

  payment(data){
    return this.http.post<{
      error: boolean,
      message: string,
      response,
      order,
      id,amount
      key
      payload
    }>(`${environment.baseUrl}/payment/create-order`,data)
  }
  getVisitor(start, end) {
    return this.http.get<{
      error: boolean,
      message: string,
      visitorArray: VisitorResponse[]
    }>(`${environment.baseUrl}/visitor/get-all-visitor/${start}/${end}`)
  }

  getPendingVisitor(start, end) {
    return this.http.get<{
      error: boolean,
      message: string,
      response: VisitorResponse[]
    }>(`${environment.baseUrl}/visitor/get-pending-visitor/${start}/${end}`)
  }

  getRememberedVisitor() {
    return this.http.get<{
      error: boolean,
      message: string,
      response: VisitorResponse[]
    }>(`${environment.baseUrl}/visitor/get-remembered-visitor`)
  }
  
  getMeargedData() {
    return this.http.get<{
      error: boolean,
      message: string,
      finalResponse: VisitorResponse[]
    }>(`${environment.baseUrl}/visitor/get-both-in-timeline`)
  }

  
  evacuateAll(data){
    return this.http.post<{
      error:Boolean,
      message:string,
      response:VisitorResponse[]

    }>(`${environment.baseUrl}/visitor/evacuationAll`,data)
  }

  getTodayVisitor(postData) {
    return this.http.post<{
      error: boolean,
      message: string,
      visitorData: VisitorResponse[]
    }>(`${environment.baseUrl}/visitor/get-today-visitor`, postData)
  }

  addLogout(id, finalDate) {
    return this.http.put<{
      error: boolean,
      message: string
    }>(`${environment.baseUrl}/visitor/add-logout/${id}`, finalDate)
  }

  addLogoutAll(finalDate) {
    return this.http.put<{
      error: boolean,
      message: string
    }>(`${environment.baseUrl}/visitor/add-logout-all/`, finalDate)
  }

  anonymizeVisitor(data) {
    return this.http.put<{
      error: boolean,
      message: string,
    }>(`${environment.baseUrl}/visitor/anonymize-visitor-all`,data)
  }

  remainingVisitor() {
    return this.http.get<{
      error: boolean,
      data
    }>(`${environment.baseUrl}/visitor/remaining-logout`)
  }

  remainingVisitorByDate(finalDate) {
    return this.http.post<{
      error: boolean,
      visitorData: VisitorResponse[]
    }>(`${environment.baseUrl}/visitor/remaining-logout-by-date/`, finalDate)
  }

  addNewVisitor(visitorDetails) {
    return this.http.post<{
      error: boolean,
      message: string,
      visitorData
    }>(`${environment.baseUrl}/visitor/add-visitors`, visitorDetails)
  }

  updateVisitor(id: string, visitor) {
    return this.http.put<{
      error: boolean,
      message: string,
      response
    }>(`${environment.baseUrl}/visitor/edit-visitor/${id}`, visitor)
  }


  checkApprovel(id: string, visitor) {
    return this.http.put<{
      error: boolean,
      message: string,
      response
    }>(`${environment.baseUrl}/visitor/approval-status/${id}`, visitor)
  }



  deletevisitor(id: string) {
    return this.http.delete<{
      error: boolean,
      message: string
    }>(`${environment.baseUrl}/visitor/delete-visitor/${id}`)
  }

  postVisitor(addDtails) {
    return this.http.post<{
      error: boolean,
      message: string,
      visitorArray: VisitorResponse[]
    }>(`${environment.baseUrl}/visitor/add-visitors`, addDtails)
  }

  getCompanyLocations() {
    return this.http.get<{
      error: boolean,
      message: string,
      deviceData
    }>(`${environment.baseUrl}/devicelocation/get-company-locations`)
  }

  signOutVisitors(id,date) {
    return this.http.put<{
      error: boolean,
      message: string,
      response: VisitorResponse
    }>(`${environment.baseUrl}/visitor/add-logout/${id}`,date)

  }

  signInVisitors(id,date) {
    return this.http.put<{
      error: boolean,
      message: string,
      response: VisitorResponse
    }>(`${environment.baseUrl}/visitor/signin-visitor/${id}`,date)

  }

  

  // SignOutAllVisitor(data){
  //   return this.http.put<{
  //     error: boolean,
  //     message: string,
  //     response: VisitorResponse
  //   }>(`${environment.baseUrl}/visitor/add-logout-all`,data)
  // }

  SignOutAllVisitor(data){
    return this.http.put<{
      error:Boolean,
      message:string,
      // response:EmployeeSignOutResponse
    }>(`${environment.baseUrl}/visitor/visitors-logout`,data)
  }


  getAllEvacuationData(){
    return this.http.get<{
      error: boolean,
      message: string,
      response: VisitorResponse[]
    }>(`${environment.baseUrl}/visitor/get-both-in-timeline`)

  }
}
