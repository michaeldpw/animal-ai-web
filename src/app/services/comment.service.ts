import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {COMMENT_CREATION_URL, POST_URL, TIMELINE_CREATION_URL, TIMELINE_URL} from '../shared/constants/urls';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getAllCommentsByPost(postId: string):Observable<any> {
    return this.http.get(`${POST_URL}/${postId}/comments`);
  }

  createComment(commentData: any):Observable<any> {
    return this.http.post(`${COMMENT_CREATION_URL}`, commentData);
  }
}
