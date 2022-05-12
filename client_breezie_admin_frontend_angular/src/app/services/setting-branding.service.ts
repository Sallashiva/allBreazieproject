import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingBrandingService {

  constructor(private http:HttpClient) { }



  getSettings(){
    return this.http.get<{
      error: boolean,
      message: string,
      settings:any
    }>(`${environment.baseUrl}/setting/get-all-settings`)
  }


  updateBarndColor(color){
    let data={
      color:color,
    }
    return this.http.put < {
      error: boolean,
      message: string,
      response
    } > (`${environment.baseUrl}/setting/edit-brand-colour`,data)

  }
  
  addCompanyLogo(companyLogo:File,
    idBadge:string,
    email:string,
    contactless:string,){
    let Data= new FormData();
    Data.append("companyLogo",companyLogo);
    Data.append("idBadge",idBadge)
    Data.append("email",email);
    Data.append("contactless",contactless)
    return this.http.post < {
      error: boolean,
      message: string,
      response
    } > (`${environment.baseUrl}/setting/add-brand-logo`,Data)

  }

  getCompanyLogo(){
    return this.http.get < {
      error: boolean,
      message: string,
     response
    } > (`${environment.baseUrl}/setting/get-brand-logo`)
  }

  deleteCompanyLogo(id){
    return this.http.delete< {
      error: boolean,
      message: string
    } > (`${environment.baseUrl}/setting/delete-brand-logo/${id}`)
  }
  selectValue(id,value){
    return this.http.put< {
        error:Boolean,
        message:string,
        response:any
    } >(`${environment.baseUrl}/setting/brand-selected/${id}`,value)
  }
}
