import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactBrowserComponent } from './contact-browser.component';

describe('ContactBrowserComponent', () => {
  let component: ContactBrowserComponent;
  let fixture: ComponentFixture<ContactBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
