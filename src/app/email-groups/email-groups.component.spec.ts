import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailGroupsComponent } from './email-groups.component';

describe('EmailGroupsComponent', () => {
  let component: EmailGroupsComponent;
  let fixture: ComponentFixture<EmailGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
