import { TestBed } from '@angular/core/testing';

import { WelcomeAuthGuard } from './welcome-auth.guard';

describe('WelcomeAuthGuard', () => {
  let guard: WelcomeAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(WelcomeAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
