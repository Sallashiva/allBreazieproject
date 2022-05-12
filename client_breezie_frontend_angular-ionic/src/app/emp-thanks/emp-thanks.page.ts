import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-emp-thanks',
  templateUrl: './emp-thanks.page.html',
  styleUrls: ['./emp-thanks.page.scss'],
})
export class EmpThanksPage implements OnInit {

  visitorId: string;
  employeeId: string
  path: string;
  subscription: Subscription;

  constructor(
    private navController: NavController,
    private modalCtrl: ModalController,
    private platform: Platform
  ) {}

  ngOnInit() {
    setTimeout(() =>{
      this.navController.navigateRoot(['home'])
    },3000)

  }



}
