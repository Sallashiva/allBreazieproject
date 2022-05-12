import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  constructor(private http:HttpClient) { }

  addScreen(imagePath: File) {
    const postData = new FormData();
    postData.append("imagePath", imagePath);
    return this.http.post < {
      error: boolean,
      message: string,
    } > (`${environment.baseUrl}/screen/add-screens`, postData)
  }

  getScreens(){
    return this.http.get < {
      error: boolean,
      message: string,
      screenData:[]
    } > (`${environment.baseUrl}/screen/get-all-screens`)
  }

  deleteScreen(id: string) {
    return this.http.delete < {
      error: boolean,
      message: string
    } > (`${environment.baseUrl}/screen/delete-screen/${id}`)
  }
  selectScreen(id: string){
    return this.http.put<{
      error: boolean,
      message: string
    } > (`${environment.baseUrl}/screen/select-screen/${id}`,"trur")
  }
}
