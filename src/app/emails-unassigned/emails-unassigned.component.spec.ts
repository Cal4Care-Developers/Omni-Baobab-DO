import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailsUnassignedComponent } from './emails-unassigned.component';

describe('EmailsUnassignedComponent', () => {
  let component: EmailsUnassignedComponent;
  let fixture: ComponentFixture<EmailsUnassignedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailsUnassignedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailsUnassignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
