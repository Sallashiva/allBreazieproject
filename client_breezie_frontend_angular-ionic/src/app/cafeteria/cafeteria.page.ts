import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ModalPage } from '../modal/modal.page';
import { RegisterService } from '../register/register.service';
@Component({
  selector: 'app-cafeteria',
  templateUrl: './cafeteria.page.html',
  styleUrls: ['./cafeteria.page.scss'],
})

export class CafeteriaPage implements OnInit {
  visitorId: string;
  employeeId: string
  path: string;
  subscription: Subscription;

  constructor(
    private navController: NavController,
    private modalCtrl: ModalController,
    private platform: Platform,
    private RegisterService: RegisterService
  ) {}

  ngOnInit() {
    this.path = `/camera/camera`;

    
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navController.navigateBack(this.path);
    });
    this.RegisterService.changeVisitorId()
  }

  skip() {
    this.navController.navigateRoot(['cafeteria/thankyou']);
  }

  refreshment() {
    this.subscription = this.RegisterService.currentVisitorId.subscribe(email => {
      this.visitorId = email;
    });
    this.navController.navigateRoot(['cafeteria/cafeteria-item']);
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
