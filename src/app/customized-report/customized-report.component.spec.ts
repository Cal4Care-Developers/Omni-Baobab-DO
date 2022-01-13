import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizedReportComponent } from './customized-report.component';

describe('CustomizedReportComponent', () => {
  let component: CustomizedReportComponent;
  let fixture: ComponentFixture<CustomizedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
