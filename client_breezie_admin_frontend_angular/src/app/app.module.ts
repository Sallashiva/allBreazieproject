import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { OtpComponent } from './forgot-password/otp/otp.component';
import { EmailComponent } from './forgot-password/email/email.component';
import { ResetPasswordComponent } from './forgot-password/reset-password/reset-password.component';

import { MatStepperModule } from '@angular/material/stepper';

import { EmployeeSigninComponent } from './modules/employee-signin/employee-signin.component';

import { PrintComponent } from './print/print.component';
import { SearchPipe } from './pipe/search.pipe';
import { AuthorizationInterceptor } from './interceptors/authorization.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InternetInterceptor } from './interceptors/internet.interceptor';
import { EmployeeSignoutComponent } from './modules/employee-signout/employee-signout.component';
import { AddEmployeeUpdateDialogComponent } from './modules/add-employee-update-dialog/add-employee-update-dialog.component';
import { EmployeeTimelineUpdateComponent } from './modules/employee-timeline-update/employee-timeline-update.component';
import { PreRegisterUpdateComponent } from './modules/pre-register-update/pre-register-update.component';

import { VisitorSignOutModuleComponent } from './modules/visitor-sign-out-module/visitor-sign-out-module.component';

import { QRCodeModule } from 'angular2-qrcode';

import { RemotelySignInComponent } from './modules/remotely-sign-in/remotely-sign-in.component';
import { UpdateBevaragesComponent } from './modules/update-bevarages/update-bevarages.component';
import { UpdateFoodCateringComponent } from './modules/update-food-catering/update-food-catering.component';
import { VisitorSignoutAllComponent } from './modules/visitor-signout-all/visitor-signout-all.component';
import { CateringModelTrialComponent } from './modules/catering-model-trial/catering-model-trial.component';
import { VisitorSignInModuleComponent } from './modules/visitor-sign-in-module/visitor-sign-in-module.component';
import { DeliveriesUpdateComponent } from './modules/deliveries-update/deliveries-update.component';
import { AdminRoleDialogComponent } from './modules/admin-role-dialog/admin-role-dialog.component';
import { EmployeeArchiveComponent } from './modules/employee-archive/employee-archive.component';
import { EmployeeAnonymizeComponent } from './modules/employee-anonymize/employee-anonymize.component';
import { DeliveriesModelComponent } from './breezie-dashboard/deliveries-model/deliveries-model.component';
import { AddEmployeeModuleComponent } from './modules/add-employee-module/add-employee-module.component';
import { AddBulkModuleComponent } from './modules/add-bulk-module/add-bulk-module.component';
import { EmployeeRestoreComponent } from './modules/employee-restore/employee-restore.component';
import { VisitorAnonymizeModuleComponent } from './modules/visitor-anonymize-module/visitor-anonymize-module.component';
import { PreRegisterDeleteComponent } from './modules/pre-register-delete/pre-register-delete.component';
import { DeliveryModelTrialComponent } from './modules/delivery-model-trial/delivery-model-trial.component';
import { VisitorApprovalModuleComponent } from './modules/visitor-approval-module/visitor-approval-module.component';
import { VisitorRemoveModuleComponent } from './modules/visitor-remove-module/visitor-remove-module.component';
import { SharedModule } from './shared/shared.module';
import { VisitorDialogComponent } from './breezie-dashboard/visitor-dialog/visitor-dialog.component';
import { PaymentSuccessComponent } from './modules/payment-success/payment-success.component';
import { PaymentFailedComponent } from './modules/payment-failed/payment-failed.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    OtpComponent,
    EmailComponent,
    ResetPasswordComponent,
    DeliveriesModelComponent,
    AddEmployeeModuleComponent,
    AddBulkModuleComponent,
    EmployeeSigninComponent,
    EmployeeRestoreComponent,
    PrintComponent,
    SearchPipe,
    EmployeeSignoutComponent,
    AddEmployeeUpdateDialogComponent,
    EmployeeTimelineUpdateComponent,
    PreRegisterUpdateComponent,
    DeliveriesUpdateComponent,
    AdminRoleDialogComponent,
    EmployeeArchiveComponent,
    EmployeeAnonymizeComponent,
    VisitorSignOutModuleComponent,
    VisitorAnonymizeModuleComponent,
    PreRegisterDeleteComponent,
    DeliveryModelTrialComponent,
    VisitorApprovalModuleComponent,
    VisitorRemoveModuleComponent,
    RemotelySignInComponent,
    UpdateBevaragesComponent,
    UpdateFoodCateringComponent,
    VisitorSignoutAllComponent,
    CateringModelTrialComponent,
    VisitorSignInModuleComponent,
    PaymentSuccessComponent,
    PaymentFailedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    CommonModule,
    MatStepperModule,
    QRCodeModule,
    ToastrModule.forRoot({
      maxOpened: 1,
      timeOut: 2000,
      preventDuplicates: true,
    }),
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthorizationInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: InternetInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
  entryComponents: [VisitorDialogComponent],
  // entryComponents:[DeliveriesModelComponent]
})
export class AppModule { }
