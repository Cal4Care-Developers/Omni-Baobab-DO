import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketViewThreadComponent } from './ticket-view-thread.component';

describe('TicketViewThreadComponent', () => {
  let component: TicketViewThreadComponent;
  let fixture: ComponentFixture<TicketViewThreadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketViewThreadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketViewThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
