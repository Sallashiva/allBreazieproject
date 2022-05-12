import { NgModule } from '@angular/core';
import { CameraRoutingModule } from './camera.routing.module';
import { PhotoService } from '../register/photo.service';
import {  ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CameraComponent } from './camera/camera.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CameraComponent],
  imports: [
    CommonModule,
    CameraRoutingModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule

  ],
  providers: [PhotoService]
})
export class CameraModule {}
