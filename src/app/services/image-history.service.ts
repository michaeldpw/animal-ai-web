import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PHOTO_URL} from '../shared/constants/urls';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageHistoryService {

  constructor(private http: HttpClient) { }

  loadImages(deviceId: string, rangeDates: Array<any>):Observable<any> {
    // if (deviceId) return;

    let params = new HttpParams();
    console.log(rangeDates);

    // 如果选择了日期范围，则传递到后端
    if (rangeDates?.length === 2) {
      const start = rangeDates[0] ? rangeDates[0].toISOString().split('T')[0] : null;
      const end = rangeDates[1] ? rangeDates[1].toISOString().split('T')[0] : null;
      params = params.set('startDate', start).set('endDate', end);
    }

    return this.http.get<any>(`${PHOTO_URL}/${deviceId}`, { params });
    //   .subscribe({
    //   next: res => {
    //     this.groupedPhotos = res.groupedPhotos || [];
    //     this.loading = false;
    //   },
    //   error: err => {
    //     console.error('加载照片失败', err);
    //     this.loading = false;
    //   }
    // });
  }
}
