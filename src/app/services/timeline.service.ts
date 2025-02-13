import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TIMELINE_CREATION_URL, TIMELINE_URL} from '../shared/constants/urls';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {

  constructor(private http: HttpClient) { }

  getAllTimeline() {
    return this.http.get(TIMELINE_URL);
  }

  createTimeline(eventData: any) {
    return this.http.post(`${TIMELINE_CREATION_URL}`, eventData);
  }
}
