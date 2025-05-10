import { Injectable } from '@angular/core';
import {PLACE_URL, POST_CREATION_URL, POST_URL} from '../shared/constants/urls';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(private http: HttpClient) { }


  getAllPlaces() {
    return this.http.get(`${PLACE_URL}`);
  }

  createPlace(data: any) {
    const {latitude, longitude, name} = data;
    return this.http.post(`${PLACE_URL}`, {name, latitude, longitude });
  }

}
