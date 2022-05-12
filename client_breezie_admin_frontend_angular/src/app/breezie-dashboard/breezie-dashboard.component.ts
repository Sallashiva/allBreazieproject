import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-breezie-dashboard',
  templateUrl: './breezie-dashboard.component.html',
  styleUrls: ['./breezie-dashboard.component.css']
})
export class BreezieDashboardComponent implements OnInit {

  sideBarOpen = true;
  // isLogin: boolean = false;
  
  constructor(
    private router: Router,
    private registered: RegisterService,
    // private adminService: AdminService
  ) {}

  ngOnInit(){
    this.getRegisterData()
    
  }
    // this.router.events.subscribe((res) => {
    //   if (
    //     this.router.url === '/auth/login' ||
    //     this.router.url === '/auth/register' ||
    //     this.router.url === '/email' ||
    //     this.router.url === `/otp` ||
    //     this.router.url === '/reset-password' ||
    //     this.router.url === '/auth/register-thankyou' ||
    //     this.router.url === '/auth/register-password'
    //   ) {
    //     this.isLogin = false;
    //   } else {
    //     this.isLogin = true;
    //   }
    // });
    // this.checkLogin()
  
  remaningDays
  getRegisterData() {
    this.registered.getRegister().subscribe(res => {
      if (!res.error) {
        let lastDay = res.registeredData.plan.endDate
        let lastDate: any = new Date(lastDay);
        let todayDate: any = new Date()
        var difference = (lastDate - todayDate)
        let days = Math.ceil(difference / (1000 * 3600 * 24))
        this.remaningDays = days
        if (this.remaningDays <= 0 ) {
          this.sideBarOpen = false
          this.router.navigate(['/breezie-dashboard/account'])
        }
      }
    });
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
