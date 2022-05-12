import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
@Component({
  selector: 'app-network-error',
  templateUrl: './network-error.component.html',
  styleUrls: ['./network-error.component.scss'],
})

export class NetworkErrorComponent implements OnInit {
  currentPath: string;
  status = "Online";
  conectado = true;

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((res) => {
      this.currentPath = res.currentPath
    })
  }

  retry() {
    this.router.navigate([this.currentPath])
  }
}
