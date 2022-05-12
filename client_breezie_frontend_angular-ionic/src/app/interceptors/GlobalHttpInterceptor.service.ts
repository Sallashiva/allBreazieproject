import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor,HttpRequest,HttpResponse,HttpErrorResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
@Injectable()
export class GlobalHttpInterceptorService {

  constructor(
    public router: Router,
    private navController: NavController
  ) {}

  intercept(req: HttpRequest < any > , next: HttpHandler): Observable < HttpEvent < any >> {
    if (!window.navigator.onLine) {
      this.navController.navigateRoot(['/error'], {
        queryParams: {
          currentPath: this.router.url
        }
      });
      return next.handle(req).pipe(
        catchError((error) => throwError(error.message))
      );
    } else {
      return next.handle(req);
    }
  }
}
