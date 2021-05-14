import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWidgetSettingsComponent } from './chat-widget-settings.component';

describe('ChatWidgetSettingsComponent', () => {
  let component: ChatWidgetSettingsComponent;
  let fixture: ComponentFixture<ChatWidgetSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatWidgetSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatWidgetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
