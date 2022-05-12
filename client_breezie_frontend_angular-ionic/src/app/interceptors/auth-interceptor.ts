// eslint-disable-next-line @typescript-eslint/no-empty-interface
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterService } from '../register/register.service';

// import {EmployeeService} from "../services/employee.service";
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private auth: RegisterService
  ) {}
  intercept(request: HttpRequest < any > , handler: HttpHandler) {
    const modifiedRequest = request.clone({
      headers: request.headers.append(
        'authorization',
        `Bearer ${this.auth.getJWT()}`
      )
    });
    return handler.handle(modifiedRequest);
  }
}
