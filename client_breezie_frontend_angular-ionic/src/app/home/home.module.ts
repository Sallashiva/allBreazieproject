import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { SignaturePadModule } from 'angular2-signaturepad';
import { HomePageRoutingModule } from './home-routing.module';
import { LoginpageComponent } from '../loginpage/loginpage.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SignaturePadModule,
    QRCodeModule
  ],
  declarations: [HomePage]
})

export class HomePageModule {}
