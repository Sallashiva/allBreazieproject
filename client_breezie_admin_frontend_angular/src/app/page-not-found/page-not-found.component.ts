import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})

export class PageNotFoundComponent implements OnInit {

  constructor(
    private empService: EmployeeService
  ) {}

  ngOnInit(): void {}
  
  loggedIn = this.empService.loggedIn()
}
