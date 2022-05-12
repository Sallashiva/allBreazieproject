import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import {EmployeeService} from '../services/employee.service';
@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  // constructor(private auth: EmployeeService) {}
  constructor() {}
  intercept(request: HttpRequest < any > , handler: HttpHandler) {
    const modifiedRequest = request.clone({
      // headers: request.headers.append(
      //   'authorization',
      //   `Bearer ${this.auth.loggedIn()}`
      // )
    });
    return handler.handle(modifiedRequest);
  }
}
