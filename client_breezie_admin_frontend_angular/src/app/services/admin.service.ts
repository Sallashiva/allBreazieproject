import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AdminResponse } from '../models/admin';

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  constructor(
    private http: HttpClient, 
    private router: Router
  ) {}

  checkUser(){
    const id = localStorage.getItem('dataBaseID');
    return this.http.get < {
      error: boolean,
      adminData: AdminResponse[]
    } > (`${environment.baseUrl}/admin/check-users/${id}`)
  }
  getAdmin() {
    return this.http.get < {
      error: boolean,
      adminData: AdminResponse[]
    } > (`${environment.baseUrl}/admin/get-all-users`)
  }

  addUser(userDetails) {
    return this.http.post < {
      error: boolean,
      message: string,
      adminData: AdminResponse
    } > (`${environment.baseUrl}/admin/register`, userDetails)
  }

  updateUser(id: string, admin: AdminResponse) {
    const postData = new FormData();
    return this.http.put < {
      error: boolean,
      message: string,
      response: AdminResponse
    } > (`${environment.baseUrl}/admin/edit-user/${id}`, admin)
  }

  deleteEmployee(id: string) {
    return this.http.delete < {
      error: boolean,
      message: string
    } > (`${environment.baseUrl}/admin/delete-users/${id}`)
  }
}
