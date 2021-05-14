import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentPermissionComponent } from './agent-permission.component';

describe('AgentPermissionComponent', () => {
  let component: AgentPermissionComponent;
  let fixture: ComponentFixture<AgentPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
