import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketingSystemNewComponent } from './ticketing-system-new.component';

describe('TicketingSystemNewComponent', () => {
  let component: TicketingSystemNewComponent;
  let fixture: ComponentFixture<TicketingSystemNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketingSystemNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketingSystemNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
