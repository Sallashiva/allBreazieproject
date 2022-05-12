import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-empsignout-thanks',
  templateUrl: './empsignout-thanks.page.html',
  styleUrls: ['./empsignout-thanks.page.scss'],
})
export class EmpsignoutThanksPage implements OnInit {

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
