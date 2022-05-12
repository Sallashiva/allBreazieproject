import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  user;
  token: string;
  myAngularxQrCode: string = null;

  constructor(
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.token = localStorage.getItem('Token');
    this.myAngularxQrCode = `https://app.breazie.com/home?key=${this.token}&device=true`;
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
