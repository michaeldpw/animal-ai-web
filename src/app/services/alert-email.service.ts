import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ALERT_EMAIL_URL, COMMENT_CREATION_URL} from '../shared/constants/urls';

@Injectable({
  providedIn: 'root'
})
export class AlertEmailService {

  constructor(private http: HttpClient) { }

  addAlertEmail(alertEmailData: any) {
    return this.http.post(`${ALERT_EMAIL_URL}/add`, alertEmailData);
  }

  getAlertEmails(deviceId: string) {
    return this.http.get(`${ALERT_EMAIL_URL}/list/${deviceId}`);
  }

  deleteAlertEmail(alertEmailId: string) {
    return this.http.delete(`${ALERT_EMAIL_URL}/${alertEmailId}`);
  }
}
