import { TestBed } from '@angular/core/testing';

import { TranslateEngineService } from './translate-engine.service';

describe('TranslateEngineService', () => {
  let service: TranslateEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslateEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
