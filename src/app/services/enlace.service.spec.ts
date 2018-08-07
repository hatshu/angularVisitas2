import { TestBed, inject } from '@angular/core/testing';

import { EnlaceService } from './enlace.service';

describe('EnlaceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnlaceService]
    });
  });

  it('should be created', inject([EnlaceService], (service: EnlaceService) => {
    expect(service).toBeTruthy();
  }));
});
