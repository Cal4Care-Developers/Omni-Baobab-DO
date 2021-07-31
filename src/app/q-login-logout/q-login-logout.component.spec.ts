import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QLoginLogoutComponent } from './q-login-logout.component';

describe('QLoginLogoutComponent', () => {
  let component: QLoginLogoutComponent;
  let fixture: ComponentFixture<QLoginLogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QLoginLogoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QLoginLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
