import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
@Component({
  selector: 'app-lastpage',
  templateUrl: './lastpage.component.html',
  styleUrls: ['./lastpage.component.scss'],
})

export class LastpageComponent implements OnInit {
  path: string;
  visitorId: string;

  constructor(
    private router: Router,
    private navController: NavController,
    private platform: Platform
    ) {}

  ngOnInit() {
    this.goHome();
    this.path = `/cafeteria/cafeteria-item`;
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navController.navigateBack(this.path);
    });
  }

 async goHome() {
  //   localStorage.clear()
  // await  Storage.clear()
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 3000);
  }
}
