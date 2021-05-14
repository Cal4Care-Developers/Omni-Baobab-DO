import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactReportComponent } from './contact-report.component';

describe('ContactReportComponent', () => {
  let component: ContactReportComponent;
  let fixture: ComponentFixture<ContactReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
