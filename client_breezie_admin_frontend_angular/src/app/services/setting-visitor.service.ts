import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'querystring';
import { environment } from 'src/environments/environment';
import { SettingVisitorResponse } from '../models/SettingVisitor';
import { VisitorResponse } from '../models/visitor';

@Injectable({
  providedIn: 'root'
})
export class SettingVisitorService {
  getBranding(arg0: string) {
    throw new Error('Method not implemented.');
  }

  constructor(private http:HttpClient) { }

  addFreeTrial(data){
    return this.http.post < {
      error: boolean,
      message: string
    } > (`${environment.baseUrl}/setting/catering-free-trial`,data)
  }

  getVisitorSetting(){
    return this.http.get < {
      error: boolean,
      message: string,
      settings
    } > (`${environment.baseUrl}/setting/get-all-settings`)
  }

  updateVisitorSetting(update) {
    return this.http.put < {
      error: boolean,
      message: string,
      companySettings:[]
      response: SettingVisitorResponse
    } > (`${environment.baseUrl}/setting/edit-remember-visitor`,update )
  }
 
  bevaragesmenu(databevergesName:string,price:any,imagePath:File){
    const data = new FormData();
    data.append("bevergesName", databevergesName);
    data.append("price", price);
    data.append("imagePath", imagePath);
    return this.http.post <{
      error:boolean,
      message:string
    }>(`${environment.baseUrl}/catering/add-beverage`,data)
  }
  getBevaragesmenu(){
    return this.http.get <{
      error:boolean,
      message:string,
      catering:any
    }>(`${environment.baseUrl}/catering/get-all-beverage`)
  }
  updateBevaragesmenu(id,bevergesName:string,price:any,imagePath:File){
    const data = new FormData();
    data.append("bevergesName", bevergesName);
    data.append("price", price);
    data.append("imagePath", imagePath);
    return this.http.put <{
      error:boolean,
      message:string
    }>(`${environment.baseUrl}/catering/upadte-beverage/${id}`,data)
  }
  deleteBevaragesmenu(id){
    return this.http.delete <{
      error:boolean,
      message:string,
    }>(`${environment.baseUrl}/catering/delete-beverage/${id}`)
  }


  
  FoodMenu(foodName:string,price:any,imagePath:File,notes:string){
    const data = new FormData();
    data.append("foodName", foodName);
    data.append("price", price);
    data.append("imagePath", imagePath);
    data.append("notes", notes);
    return this.http.post <{
      error:boolean,
      message:string
    }>(`${environment.baseUrl}/catering/add-food`,data)
  }
  getFoodmenu(){
    return this.http.get <{
      error:boolean,
      message:string,
      catering:any
    }>(`${environment.baseUrl}/catering/get-all-foods`)
  }
  updateFoodmenu(id:string,foodName:string,price:any,imagePath:File,notes:string){
    const data = new FormData();
    data.append("foodName", foodName);
    data.append("price", price);
    data.append("imagePath", imagePath);
    data.append("notes", notes);
    return this.http.put <{
      error:boolean,
      message:string
    }>(`${environment.baseUrl}/catering/upadte-food/${id}`,data)
  }
  deleteFoodmenu(id){
    return this.http.delete <{
      error:boolean,
      message:string,
    }>(`${environment.baseUrl}/catering/delete-food/${id}`)
  }
}
