import { ChangeDetectorRef, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  userDisplayName = '';
  userEditName = '';
  characterPath = '/assets/images/logo.png';
  constructor(
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
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
