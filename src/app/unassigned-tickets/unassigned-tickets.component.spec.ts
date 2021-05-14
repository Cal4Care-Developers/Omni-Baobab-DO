import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnassignedTicketsComponent } from './unassigned-tickets.component';

describe('UnassignedTicketsComponent', () => {
  let component: UnassignedTicketsComponent;
  let fixture: ComponentFixture<UnassignedTicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnassignedTicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnassignedTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
