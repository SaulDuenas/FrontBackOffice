import { TestBed } from '@angular/core/testing';

import { KnowSbcService } from './know-sbc.service';

describe('KnowSbcService', () => {
  let service: KnowSbcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KnowSbcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
