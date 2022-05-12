import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CafeteriaResponse } from './model/cafeteriaresponce';
@Injectable({
  providedIn: 'root',
})

export class RefreshmentService {

  constructor(
    private http: HttpClient
  ) {}

  refreshmentitem() {
    return this.http.get < {
      error: boolean;
      message: string;
      refreshmentData: CafeteriaResponse[];
    } > (`${environment.baseUrl}/refreshment/get-all-refreshment`);
  }

  notifyCafe(VisitorId, RefreshmentData) {
    return this.http.post < {
      error: boolean;
      message: string;
    } > (
      `${environment.baseUrl}/visitor/notify-cafe/${VisitorId}`,
      RefreshmentData
    );
  }
}
