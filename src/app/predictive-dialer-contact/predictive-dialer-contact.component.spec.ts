import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictiveDialerContactComponent } from './predictive-dialer-contact.component';

describe('PredictiveDialerContactComponent', () => {
  let component: PredictiveDialerContactComponent;
  let fixture: ComponentFixture<PredictiveDialerContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredictiveDialerContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictiveDialerContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
