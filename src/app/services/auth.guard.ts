import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from './user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const isLoggedIn = userService.isLoggedIn();

  if (isLoggedIn) {
    return true;
  } else {
    // 未登录 -> 跳转到登录页
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
