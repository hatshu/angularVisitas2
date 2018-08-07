import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitlistforPersonComponent } from './visitlistfor-person.component';

describe('VisitlistforPersonComponent', () => {
  let component: VisitlistforPersonComponent;
  let fixture: ComponentFixture<VisitlistforPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitlistforPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitlistforPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
