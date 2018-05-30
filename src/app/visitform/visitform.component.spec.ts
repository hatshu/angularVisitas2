import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitformComponent } from './visitform.component';

describe('VisitformComponent', () => {
  let component: VisitformComponent;
  let fixture: ComponentFixture<VisitformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
