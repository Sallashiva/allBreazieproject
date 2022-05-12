import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomersComponent } from './customers/customers.component';
import { RevenueComponent } from './revenue/revenue.component';
import { ReminderComponent } from './reminder/reminder.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { DayReminderComponent } from './reminder/day-reminder/day-reminder.component';
import { FifteenDaysReminderComponent } from './reminder/fifteen-days-reminder/fifteen-days-reminder.component';
import { ThirtyDaysReminderComponent } from './reminder/thirty-days-reminder/thirty-days-reminder.component';
import { AuthModule } from './auth/auth.module';
import { OtpComponent } from './auth/otp/otp.component';
import{ExcelService} from './services/excel.service';
import { MatTableExporterModule } from 'mat-table-exporter';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CustomersComponent,
    RevenueComponent,
    ReminderComponent,
    NavbarComponent,
    HeaderComponent,
    SideNavComponent,
    DayReminderComponent,
    FifteenDaysReminderComponent,
    ThirtyDaysReminderComponent,
    PageNotFoundComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    AuthModule,
    MatTableExporterModule
  ],
  providers: [ExcelService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
