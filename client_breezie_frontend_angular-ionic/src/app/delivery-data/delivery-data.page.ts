import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-delivery-data',
  templateUrl: './delivery-data.page.html',
  styleUrls: ['./delivery-data.page.scss'],
})
export class DeliveryDataPage implements OnInit {

  visitorId: string;
  employeeId: string
  path: string;
  subscription: Subscription;

  constructor(
    private navController: NavController,
    private ActivatedRouter: ActivatedRoute,
    private modalCtrl: ModalController,
    private platform: Platform
  ) {}
  Recipient:string
  ngOnInit() {
    this.path = `/camera/camera`;
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navController.navigateBack(this.path);
    });
    this.ActivatedRouter.queryParams.subscribe(params => {
      this.Recipient = params.Recipient;
    });
    setTimeout(() =>{
      this.navController.navigateRoot(['home'])
    },10000)
  }

  skip() {
    this.navController.navigateRoot(['cafeteria/thankyou']);
  }


  qrCodeOpen() {
    this.modalCtrl
      .create({
        component: ModalPage,
        backdropDismiss: false,
      })
      .then((modalres) => {
        modalres.present();
      });
  }


}
