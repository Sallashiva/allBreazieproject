import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpCameraPageRoutingModule } from './emp-camera-routing.module';

import { EmpCameraPage } from './emp-camera.page';
import { SharedModule } from '../shared/shared.module';
import { PhotoService } from '../register/photo.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpCameraPageRoutingModule,
    SharedModule
  ],
  declarations: [EmpCameraPage],
  providers: [PhotoService]
})
export class EmpCameraPageModule {}
