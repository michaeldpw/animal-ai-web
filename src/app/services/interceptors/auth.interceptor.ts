import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import {BehaviorSubject, Observable, switchMap, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {MessageService} from 'primeng/api';
import {UserService} from '../user.service';
import {GlobalService} from '../global.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  constructor(private router: Router, private globalService: GlobalService, private toastrService: ToastrService, private messageService: MessageService, private userService: UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let accessToken: string = '';
    if (localStorage.getItem('User')) {
      accessToken = JSON.parse(localStorage.getItem('User')!).accessToken
    }
    if (accessToken) {
      req = this.addToken(req, accessToken);
    }

    return next.handle(req).pipe(
      catchError((error) => {
        // Check if the error is due to an expired access token
        // if ((error.status === 500 && accessToken) || error.status === 401) {
        //   return this.handleTokenExpired(req, next);
        // }
        if (error.status === 401 || (error.error.message === 'jwt expired')) {
          return this.handleTokenExpired(req, next);
        }
        return throwError(error);
      })
    );
    // return next.handle(req).pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     if (error.status === 401 || error.status === 403) {
    //       this.userService.logout(false);
    //       // Redirect to login page
    //       this.router.navigate(['/login']).then(() => {
    //         // this.toastrService.info('请先登录', '无权访问')
    //         this.messageService.add({ severity: 'info', summary: '请先登录', detail: '无权访问' });
    //       });
    //     }
    //     if (error.status === 500) {
    //       console.log(error);
    //       this.messageService.add({ severity: 'info', summary: '服务器内部错误', detail: `${error.error.message}` });
    //     }
    //       return throwError(() => error);
    //   })
    // );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handleTokenExpired(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(this.isRefreshing);

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      // Call the refresh token endpoint to get a new access token
      return this.userService.refreshAccessToken().pipe(
        switchMap(() => {
          this.isRefreshing = false;
          const newAccessToken = JSON.parse(localStorage.getItem('User')!).accessToken;
          // Retry the original request with the new access token
          return next.handle(this.addToken(request, newAccessToken))
          //   .pipe(
          //   tap(() => {}),
          //   catchError((err: any) => {
          //     alert('a')
          //     this.router.navigateByUrl('/login').then(() => {
          //       this.messageService.add({ severity: 'info', summary: '令牌过期', detail: `请重新登陆` })
          //     });
          //     return throwError(err)
          //   })
          // );
        }),
        catchError((error) => {
          // Handle refresh token error (e.g., redirect to login page)
          this.isRefreshing = false;
          console.log(request);
          console.error('Error handling expired access token:', error);
          console.log(request.url, request.url.includes('/users/refresh-token'))
          // if (request.url.includes('/users/refresh-token')) {
            // 只有当refresh token失败才弹出用户
            this.userService.cleanUser();
          this.globalService.setDrawerState(false);
          this.globalService.setSidebarHiddenState(true);
            this.router.navigateByUrl('/login').then(() => {
              this.messageService.add({ severity: 'info', summary: '令牌过期', detail: `请重新登陆` })
            });
          // }
          return throwError(error);
        })
      );
    } else {
      const newAccessToken = JSON.parse(localStorage.getItem('User')!).accessToken;

      return next.handle(this.addToken(request, newAccessToken))
    }

  }
}


