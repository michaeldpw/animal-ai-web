import { Injectable } from '@angular/core';
import {POST_CREATION_URL, POST_URL} from '../shared/constants/urls';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  public token: string | null | undefined;
  public user: any;
  public headers: HttpHeaders | undefined;

  constructor(private http: HttpClient,private userService: UserService) {
    this.userService.userObservable.subscribe((newUser: any) => {
      this.user = newUser;
      this.headers = new HttpHeaders().set('Authorization', `Bearer ${this.user.accessToken}`);
    })
  }

  getAllPosts(page: number, pageSize: number) {
    return this.http.get(`${POST_URL}?page=${page}&limit=${pageSize}`);
  }

  getPostDetail(postID: string) {
    return this.http.get(`${POST_URL}/${postID} `);
  }

  createPost(title: any, content: any, userId: string) {
    return this.http.post(`${POST_CREATION_URL}`, {title, content, userId});
  }
}
