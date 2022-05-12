import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { LogoutComponent } from './employees/employees.component';
import { NetworkErrorComponent } from './network-error/network-error.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeAuthGuard } from './home-auth.guard';
import { WelcomeAuthGuard } from './welcome-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcomepage',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    // canActivate: [HomeAuthGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'cafeteria',
    loadChildren: () => import('./cafeteria/cafeteria.module').then(m => m.CafeteriaPageModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'modal',
    loadChildren: () => import('./modal/modal.module').then(m => m.ModalPageModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'camera',
    loadChildren: () => import('./camera/camera.module').then(m => m.CameraModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'welcomepage',
    loadChildren: () => import('./welcomepage/welcomepage.module').then( m => m.WelcomepagePageModule),
    // canActivate: [WelcomeAuthGuard]
  },
  {
    path: 'login-id',
    loadChildren: () => import('./login-id/login-id.module').then( m => m.LoginIdPageModule),
    // canActivate: [WelcomeAuthGuard]
  },
  {
    path: 'visitor-logout',
    loadChildren: () => import('./visitor-logout/visitor-logout.module').then( m => m.VisitorLogoutPageModule)
  },
  {
    path: 'visitor-check',
    loadChildren: () => import('./visitor-check/visitor-check.module').then( m => m.VisitorCheckPageModule)
  },
  {
    path: 'employee-signout',
    loadChildren: () => import('./employee-signout/employee-signout.module').then( m => m.EmployeeSignoutPageModule)
  },
  {
    path: 'employee-signin',
    loadChildren: () => import('./employee-signin/employee-signin.module').then( m => m.EmployeeSigninPageModule)
  },
  {
    path: 'empsignin',
    loadChildren: () => import('./empsignin/empsignin.module').then( m => m.EmpsigninPageModule)
  },
  {
    path: 'empsignout',
    loadChildren: () => import('./empsignout/empsignout.module').then( m => m.EmpsignoutPageModule)
  },
  {
    path: 'emp-camera',
    loadChildren: () => import('./emp-camera/emp-camera.module').then( m => m.EmpCameraPageModule)
  },
  {
    path: 'emp-thanks',
    loadChildren: () => import('./emp-thanks/emp-thanks.module').then( m => m.EmpThanksPageModule)
  },
  {
    path: 'empsignout-thanks',
    loadChildren: () => import('./empsignout-thanks/empsignout-thanks.module').then( m => m.EmpsignoutThanksPageModule)
  },
  {
    path: 'thanks-logout',
    loadChildren: () => import('./device-thankyou/device-thankyou.module').then(m => m.DeviceThankyouPageModule)
  },
  {
    path: 'login',
    component: LoginpageComponent
  },
  {
    path: 'employees',
    component: LogoutComponent
  },
  {
    path: 'delivery',
    loadChildren: () => import('./delivery/delivery.module').then( m => m.DeliveryPageModule)
  },
  {
    path: 'delivery-data',
    loadChildren: () => import('./delivery-data/delivery-data.module').then( m => m.DeliveryDataPageModule)
  },
  {
    path: 'device-thankyou',
    loadChildren: () => import('./device-thankyou/device-thankyou.module').then( m => m.DeviceThankyouPageModule)
  },
  {
    path: 'general-delivery',
    loadChildren: () => import('./general-delivery/general-delivery.module').then( m => m.GeneralDeliveryPageModule)
  },
  {
    path: 'error',
    component: NetworkErrorComponent
  },
  {
    path: '404',
    component: PageNotFoundComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/404'
  },



];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
