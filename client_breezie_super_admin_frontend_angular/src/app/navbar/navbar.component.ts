import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  sideBarOpen: boolean = true;
  toggleSidebarForMe: any;
  userDisplayName = '';
  userEditName = '';
  constructor(
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  ngAfterContentChecked() {
    this.changeDetector.detectChanges()
    this.userDisplayName = localStorage.getItem('userName');
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

  logOut() {
    this.router.navigate(['/auth/login']);
    localStorage.clear();
  }
}
