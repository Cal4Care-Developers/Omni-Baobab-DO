import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketComposeComponent } from './ticket-compose.component';

describe('TicketComposeComponent', () => {
  let component: TicketComposeComponent;
  let fixture: ComponentFixture<TicketComposeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketComposeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketComposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
