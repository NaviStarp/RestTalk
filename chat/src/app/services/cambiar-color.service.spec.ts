import { TestBed } from '@angular/core/testing';

import { CambiarColorService } from './cambiar-color.service';

describe('CambiarColorService', () => {
  let service: CambiarColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CambiarColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
