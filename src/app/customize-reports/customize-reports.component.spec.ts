import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeReportsComponent } from './customize-reports.component';

describe('CustomizeReportsComponent', () => {
  let component: CustomizeReportsComponent;
  let fixture: ComponentFixture<CustomizeReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizeReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
