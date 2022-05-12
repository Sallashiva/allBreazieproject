import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
// import { Device } from '@awesome-cordova-plugins/device/ngx';
import { RegisterService } from '../register/register.service';

@Component({
  selector: 'app-welcomepage',
  templateUrl: './welcomepage.page.html',
  styleUrls: ['./welcomepage.page.scss'],
})
export class WelcomepagePage implements OnInit {


  constructor(
    private router: Router,
    private registerService: RegisterService,
    // private device: Device
  ) {

  }

  ngOnInit() {

    this.checkIsLogin();

  //  let token = localStorage.getItem('Token')
  //   if(!token) {
  //     this.router.navigate(['/welcomepage']);
  //   }
  }
token: any
 checkIsLogin = async () => {
  this.token = await Storage.get({
    key: "Token"
  })
  if (this.token.value) {
    this.router.navigate(['/home']);

  }
 }
  navigateToLogin() {
    this.router.navigate(['/login-id']);
  }
}
