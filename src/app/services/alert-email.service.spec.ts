import { TestBed } from '@angular/core/testing';

import { AlertEmailService } from './alert-email.service';

describe('AlertEmailService', () => {
  let service: AlertEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
