import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authgGuard } from './authg.guard';

describe('authgGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authgGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
