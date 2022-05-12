import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../register/register.service';
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    private registerService: RegisterService
  ) {}

  ngOnInit() {}
  
  loggedIn = this.registerService.loggedIn()
}
