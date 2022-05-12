import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignaturePadModule } from 'angular2-signaturepad';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SignaturePadModule,
    MatIconModule,
    MatTableModule
  ],

  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
     SignaturePadModule,
     MatIconModule,
     MatTableModule,
     MatInputModule,
     MatProgressSpinnerModule,
     MatDialogModule,
    MatIconModule

  ]
})

export class SharedModule {}
