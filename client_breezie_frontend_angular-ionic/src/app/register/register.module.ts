import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegisterPageRoutingModule } from './register-routing.module';
import { RegisterPage } from './register.page';
import { SharedModule } from '../shared/shared.module';
import { SignaturePadModule } from 'angular2-signaturepad';
import { SignatureDirective } from './signature.directive';
import { EmployeelistComponent } from './employeelist/employeelist.component';
import { ConditionsComponent } from './conditions/conditions.component';
import { SearchPipe } from './search.pipe';
import { AlphabetFilterModule } from 'alphabet-filter';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    SignaturePadModule,
    SharedModule,
    ReactiveFormsModule,
    AlphabetFilterModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
  ],
  declarations: [
    RegisterPage,
    SignatureDirective,
    EmployeelistComponent,
    ConditionsComponent,
    SearchPipe
  ],
})

export class RegisterPageModule {}
