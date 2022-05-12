import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  private userEmail = new BehaviorSubject('abc@gmail.com');
  currentEmail = this.userEmail.asObservable();
  constructor(private http: HttpClient,private router:Router) { }
  sendOtp(otp) {
     return this.http.post<{error:boolean,message:string}>(`${environment.baseUrl}/admin/check-otp`,otp)
    }
    email(sendEmail){
      return this.http.post<{error:boolean,message:string}>(`${environment.baseUrl}/admin/forgot-password`,sendEmail)
    }
    resetPassword(password){
      return this.http.put<{error:boolean,message:string}>(`${environment.baseUrl}/admin/update-password`,password)
    }

    changeMessage(email: string) {
      this.userEmail.next(email);
      
    }
}
