import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WelcomeScreenService {

  constructor(
    private http: HttpClient
  ) { }


  editWelcomeScreen(formData) {
    return this.http.put<{
      error: boolean,
      message: string,
      response
    }>(`${environment.baseUrl}/setting/edit-welcom-screen`,formData)

  }

  getWelcomScreen(){
    return this.http.get<{
      error: boolean,
      message: string,
      settings:any
    }>(`${environment.baseUrl}/setting/get-all-settings`)
  }
  

  addImage( image:File){
      let imageData= new FormData();
      imageData.append("image",image)
    return this.http.post<{
      error: boolean,
      message: string,
      response
    }>(`${environment.baseUrl}/setting/edit-screen-image`,imageData)

  }

  getImage(){
    return this.http.get<{
      error: boolean,
      message: string,
      response
    }>(`${environment.baseUrl}/setting/get-screen-image`)
  }


  updateImage(id,hidden){
    let obj={
      hidden: hidden
    }
    return this.http.put<{
      error: boolean,
      message: string,
    }>(`${environment.baseUrl}/setting/update-screen-image/${id}`,obj)
  }


  selectImage(id,hidden){
    return this.http.put<{
      error: boolean,
      message: string,
    }>(`${environment.baseUrl}/setting/selected-screen-image/${id}`,hidden)
  }

  

  deleteImage(id){
    return this.http.delete<{
      error: boolean,
      message: string,
    }>(`${environment.baseUrl}/setting/remove-image/${id}`)

  }
}
