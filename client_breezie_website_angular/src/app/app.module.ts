import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactComponent } from './contact/contact.component';
import { OthersComponent } from './others/others.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { ProductFeaturesComponent } from './product-features/product-features.component';
import { ProductsVisitorManagementComponent } from './products-visitor-management/products-visitor-management.component';
import { ProductsEmployeeCheckinComponent } from './products-employee-checkin/products-employee-checkin.component';
import { PricingComponent } from './pricing/pricing.component';
import { CareerComponent } from './career/career.component';
import { ToastrModule } from 'ngx-toastr';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutUsComponent,
    ContactComponent,
    OthersComponent,
    ProductFeaturesComponent,
    ProductsVisitorManagementComponent,
    ProductsEmployeeCheckinComponent,
    PricingComponent,
    CareerComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
