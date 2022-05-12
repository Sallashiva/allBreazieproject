import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountAddOnsResponse, AccountDetails, AccountResponse } from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(private http: HttpClient, ) { }


  getSample(){
    return true
  }

  getPlans() {
    return this.http.get < {
      error: boolean,
      plandetails,
      adminData: AccountResponse[]
    } > (`${environment.baseUrl}/plansandpricing/get-all-plans`)
  }


  getAddOns() {
    return this.http.get < {
      error: boolean,
      plandetails: AccountAddOnsResponse[]
    } > (`${environment.baseUrl}/plansandpricing/get-all-addons`)
  }


  addPlans(planDetails) {
    return this.http.post < {
      error: boolean,
      message: string,
      adminData: AccountResponse
    } > (`${environment.baseUrl}/plansandpricing/add-plan-pricing`, planDetails)
  }

  getRegister() {
    return this.http.get < {
      error: boolean,
      message: string,
      registeredData
    } > (`${environment.baseUrl}/register/get-registered-user`)
  }
  
  getAccounts() {
    return this.http.get < {
      error: boolean,
      message: string,
      accountdetails:AccountDetails
    } > (`${environment.baseUrl}/account/get-account-details`)
  }

  accountDetails(accountDetails) {
    return this.http.put < {
      error: boolean,
      message: string,
      adminData: AccountResponse
    } > (`${environment.baseUrl}/account/add-account-details`, accountDetails)
  }

  invoiceAddress(invoiceAddress) {
    return this.http.put < {
      error: boolean,
      message: string,
      adminData: AccountResponse
    } > (`${environment.baseUrl}/account/add-invoice-address`, invoiceAddress)
  }

}
