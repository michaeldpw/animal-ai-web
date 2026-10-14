import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {User} from "../shared/models/Users";
import {IUserLogin} from "../shared/interfaces/IUserLogin";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {
  REFRESH_TOKEN_URL, UPDATE_USER_AVATAR,
  UPDATE_USER_PASSWORD,
  USER_LOGIN_URL,
  USER_LOGOUT_URL,
  USER_REGISTER_URL
} from "../shared/constants/urls";
import {catchError, tap} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";
import {Router} from '@angular/router';
import {IUserRegister} from '../shared/interfaces/IUserRegister';
import {MessageService} from 'primeng/api';

const USER_KEY = 'User';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject(this.getUserFromLocalStorage());
  public userObservable: Observable<User>;

  constructor(private http: HttpClient, private router: Router, private toastrService: ToastrService, public messageService: MessageService) {
    this.userObservable = this.userSubject.asObservable();
  }

  register(userRegister: IUserRegister):Observable<User> {
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap((user: any) => {
          console.log(user);
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          // this.toastrService.success(
          //   `欢迎, ${user.nickName}!`,
          //   '注册成功'
          // );
          this.messageService.add({ severity: 'success', summary: '注册成功', detail: `欢迎, ${user.user.nickName}!`});
        },
        (errorResponse) => {
          // this.toastrService.error(
          //   `${errorResponse.error}`,
          //   '注册失败'
          // )
          this.messageService.add({ severity: 'error', summary: '注册失败', detail: `${errorResponse.error}` });

        })
    );
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('User');
    return !!token;
  }

  login(userLogin: IUserLogin):Observable<any> {
    return this.http.post<any>(USER_LOGIN_URL, userLogin).pipe(
      tap((res) => {
        console.log(res);
        this.setUserToLocalStorage(res);
        this.userSubject.next(res);
        this.messageService.add({ severity: 'success', summary: `登录成功`, detail: `${res.message}!` });

        },
        (errorResponse) => {
          this.messageService.add({ severity: 'error', summary: '登录失败', detail: `${errorResponse.error.message? errorResponse.error.message : '不明错误'}` });

        })
    );
  }

  updatePassword(oldPassword: any, newPassword: any) {
    return this.http.put(UPDATE_USER_PASSWORD, {oldPassword, newPassword});
  }

  updateAvatar(file: File) {
    const formData = new FormData();
    formData.append("avatar", file);

    return this.http.post(UPDATE_USER_AVATAR, formData);
  }

  logout(backToHome: boolean) {
    const header = new HttpHeaders().set('Authorization', `Bearer ${JSON.parse(localStorage.getItem(USER_KEY)!).accessToken}`);
    return this.http.post(USER_LOGOUT_URL, {user: JSON.parse(localStorage.getItem(USER_KEY)!)},{headers: header} ).pipe(
      tap((res: any) => {
        this.userSubject.next(new User());
        localStorage.removeItem(USER_KEY);
          this.router.navigateByUrl('/login');

      },
        (error => {
          this.messageService.add({ severity: 'error', summary: '退出失败', detail: `${error.error.message}` });
        })
    ))

  }

  cleanUser() {
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
  }

  private setUserToLocalStorage(user:User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage() {
    const userJson = localStorage.getItem(USER_KEY);
    console.log(JSON.parse(JSON.stringify(userJson)));
    if (userJson) return JSON.parse(userJson);
    return {};
  }

  refreshAccessToken(): Observable<any> {
    // Call the refresh token endpoint to get a new access token
    const refreshToken = JSON.parse(localStorage.getItem(USER_KEY)!).refreshToken;
    return this.http.post<any>(`${REFRESH_TOKEN_URL}`, { refreshToken }).pipe(
      tap((response) => {
        console.log((response))
        // Update the access token in the local storage
        localStorage.setItem('User', JSON.stringify({
          ...JSON.parse(localStorage.getItem(USER_KEY)!),
          accessToken: response.accessToken,
          refreshToken: response.refreshToken
        }));
        // console.log({
        //   ...JSON.parse(localStorage.getItem(USER_KEY)!),
        //   accessToken: response.accessToken
        // })
      }),
      catchError((error) => {
        // Handle refresh token error (e.g., redirect to login page)
        console.error('Error refreshing access token:', error);
        return throwError(error);
      })
    );
  }
}
