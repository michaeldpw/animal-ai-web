import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginRegisterGuardGuard } from './login-register-guard.guard';

describe('loginRegisterGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginRegisterGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
