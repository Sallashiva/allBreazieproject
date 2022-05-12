import {
  NgModule, NO_ERRORS_SCHEMA
} from '@angular/core';
import {
  BrowserModule
} from '@angular/platform-browser';
import {
  RouteReuseStrategy
} from '@angular/router';

import {
  IonicModule,
  IonicRouteStrategy
} from '@ionic/angular';

import {
  AppComponent
} from './app.component';
import {
  AppRoutingModule
} from './app-routing.module';
import {
  Base64ToGallery
} from '@ionic-native/base64-to-gallery/ngx';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  CommonModule
} from '@angular/common';

import {
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';

import {
  ServiceWorkerModule
} from '@angular/service-worker';
import {
  environment
} from '../environments/environment';
import {
  ToastrModule
} from 'ngx-toastr';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import {
  ModalPageModule
} from './modal/modal.module';
import {
  MatInputModule
} from '@angular/material/input';

import {
  MatFormFieldModule
} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {
  LoginpageComponent
} from './loginpage/loginpage.component';
import {
  PageNotFoundComponent
} from './page-not-found/page-not-found.component';
import {
  ClickOutsideModule
} from 'ng-click-outside';
import {
  MatIconModule
} from '@angular/material/icon';
import {
  GlobalHttpInterceptorService
} from './interceptors/GlobalHttpInterceptor.service';
import {
  Network
} from '@ionic-native/network/ngx';
import {
  NetworkErrorComponent
} from './network-error/network-error.component';
import {
  LogoutComponent
} from './employees/employees.component';
import {
  LogoutsearchPipe
} from './logoutsearch.pipe';
import {
  MatTableModule
} from '@angular/material/table';
import {
  MatButtonModule
} from '@angular/material/button';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { QRCodeModule } from 'angularx-qrcode';
import { SharedModule } from './shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  declarations: [AppComponent, LoginpageComponent, PageNotFoundComponent, NetworkErrorComponent, LogoutComponent, LogoutsearchPipe],
  entryComponents: [],

  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatTableModule,
    ModalPageModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ClickOutsideModule,
    SharedModule,
    MatIconModule,
    QRCodeModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatPaginatorModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      maxOpened: 1,
      timeOut: 3000,
      preventDuplicates: true,
    })
  ],

  providers: [{
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    }, Base64ToGallery, {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    Network, {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }
  ],
  bootstrap: [AppComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})

export class AppModule {}
