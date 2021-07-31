import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSignatureComponent } from './ticket-signature.component';

describe('TicketSignatureComponent', () => {
  let component: TicketSignatureComponent;
  let fixture: ComponentFixture<TicketSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
