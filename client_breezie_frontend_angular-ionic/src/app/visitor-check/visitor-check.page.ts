import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VistorService } from '../vistor.service';

@Component({
  selector: 'app-visitor-check',
  templateUrl: './visitor-check.page.html',
  styleUrls: ['./visitor-check.page.scss'],
})
export class VisitorCheckPage implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit() {
    this.getUserData();
  }

  userName:any
  companyName:any
  date:any
  time:any
  imageUrl:any
  getUserData() {
    let user = localStorage.getItem('userData');
    let userData = JSON.parse(user)
    this.userName = userData.FullName
    this.companyName = userData.CompanyName
    this.date = userData.finalDate
    this.time = userData.finalDate
    this.imageUrl = userData.imageUrl
  }



    // url.then((res) => {
    //   let split = res.split(",")
    //   if (split[0] === "data:image/jpeg;base64" || split[0] === "data:image/png;base64") {
    //     this.imageUrl = res;
    //     this.photoStageData.imageUrl = this.imageUrl;
    //     this.photoStageData.finalDate = new Date();
    //     this.visitorPhoto.patchValue({
    //       VisitorImage: this.imageUrl,
    //     });
    //   } else {
    //     this.toastr.error('Only Images are allowed');
    //     throw "err"
    //   }
    // })

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  navigateToWelcome() {
    localStorage.removeItem('userData');
    this.router.navigate(['/welcomepage']);
  }


}
