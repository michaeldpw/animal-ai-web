import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DEVICE_URL, UPLOAD_URL} from '../shared/constants/urls';

@Injectable({
  providedIn: 'root'
})
export class DiagnosisService {

  constructor(private http: HttpClient) {

  }

  uploadAndDiagnosis(data: any) {
    const {file, deviceId} = data;
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('animalType', 'cow');
    formData.append('deviceId', deviceId);
    console.log(deviceId);
    return this.http.post(`${UPLOAD_URL}/upload-photo`, formData);
  }
}
