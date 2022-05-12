import { useAnimation } from '@angular/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { CareerComponent } from './career/career.component';
import { ContactComponent } from './contact/contact.component';
import { OthersComponent } from './others/others.component';
import { PricingComponent } from './pricing/pricing.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ProductFeaturesComponent } from './product-features/product-features.component';
import { ProductsEmployeeCheckinComponent } from './products-employee-checkin/products-employee-checkin.component';
import { ProductsVisitorManagementComponent } from './products-visitor-management/products-visitor-management.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'about-us',
    pathMatch: 'full'
  },
  { path: "about-us", component: AboutUsComponent },
  { path: "features", component: ProductFeaturesComponent },
  { path: "visitor-management", component: ProductsVisitorManagementComponent },
  { path: "employee-checkin", component: ProductsEmployeeCheckinComponent },
  { path: "pricing", component: PricingComponent },
  { path: "career", component: CareerComponent },
  { path: "contact-us", component: ContactComponent },
  { path: "others", component: OthersComponent },
  { path: "privacy", component: PrivacyPolicyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
