import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentGroupsComponent } from './agent-groups.component';

describe('AgentGroupsComponent', () => {
  let component: AgentGroupsComponent;
  let fixture: ComponentFixture<AgentGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
