import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from './user.service';

export const loginRegisterGuardGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const isLoggedIn = userService.isLoggedIn();

  if (isLoggedIn) {
    router.navigate(['/']);
    return false;
  } else {
    return true;

  }
};
