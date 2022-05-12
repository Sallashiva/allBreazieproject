import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'breaziewebsite';
  sidenav: boolean = false;
  constructor(private router: Router) { }
  openNav() {
    this.sidenav = true;
  }
  closeNav() {
    this.sidenav = false;
  }
  features() {
    this.router.navigate(['/features'])
    this.sidenav = false;
  }
  visitorManagement() {
    this.router.navigate(['/visitor-management'])
    this.sidenav = false;
  }
  employeecheckin() {
    this.router.navigate(['/employee-checkin'])
    this.sidenav = false;
  }
  aboutus() {
    this.router.navigate(['/about-us'])
    this.sidenav = false;
  }
  contactus() {
    this.router.navigate(['/contact-us'])
    this.sidenav = false;
  }
  pricing() {
    this.router.navigate(['/pricing'])
    this.sidenav = false;
  }
  career() {
    this.router.navigate(['/career'])
    this.sidenav = false;
  }
  others() {
    this.router.navigate(['/others'])
    this.sidenav = false;
  }
  privacyPolicy() {
    this.router.navigate(['/privacy'])
  }
}
