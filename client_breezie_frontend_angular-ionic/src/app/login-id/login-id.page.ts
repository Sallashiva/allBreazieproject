import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../register/register.service';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { ToastrService } from 'ngx-toastr';
import { Storage } from '@capacitor/storage';


@Component({
  selector: 'app-login-id',
  templateUrl: './login-id.page.html',
  styleUrls: ['./login-id.page.scss'],
})
export class LoginIdPage implements OnInit {

   rForm: FormGroup;
  constructor( private router: Router,
               private registerService: RegisterService ,
               private toastr: ToastrService
               ) {}

  ngOnInit() {
    this.rForm = new FormGroup({
      deviceId: new FormControl('')
    });
  }

  // isConnected:any

  navigateToLogin() {
    this.router.navigate(['/welcomepage']);
  }
  setting
  details:any
  onSubmit(rForm: FormGroup) {

      this.registerService.loginDevice(rForm.value).subscribe(async res =>{
        if (!res.error) {
          this.registerService.setData(this.details);
          this.toastr.success(res.message)
          this.router.navigate(['/home']);
          localStorage.setItem('Token',res.token);
          localStorage.setItem('DeviceId',rForm.value.deviceId);
          await Storage.set({
            key: "Token",
            value: res.token
          })
          await Storage.set({
            key: "DeviceId",
            value: rForm.value.deviceId
          })

        } else {
        this.toastr.error(res.message);
        }
      }, error => {
        if (error) {
          this.toastr.error(error.error.message)
        } else {
          this.toastr.error("connection error")
        }
      });
  }
}
