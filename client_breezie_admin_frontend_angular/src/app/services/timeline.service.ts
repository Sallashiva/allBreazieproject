import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TimelineResponse } from '../models/timeline';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {

  constructor(private http: HttpClient,) { }


  getTimeline(start, end) {
    return this.http.get<{
      error: boolean,
      message: string,
      timeline: TimelineResponse[],
    }>(`${environment.baseUrl}/timeline/get-employees-timeline/${start}/${end}`)
  }
}
