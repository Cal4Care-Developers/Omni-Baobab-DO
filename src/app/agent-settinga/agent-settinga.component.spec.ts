import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentSettingaComponent } from './agent-settinga.component';

describe('AgentSettingaComponent', () => {
  let component: AgentSettingaComponent;
  let fixture: ComponentFixture<AgentSettingaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentSettingaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentSettingaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
