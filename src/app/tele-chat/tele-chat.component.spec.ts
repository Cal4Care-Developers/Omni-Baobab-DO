import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleChatComponent } from './tele-chat.component';

describe('TeleChatComponent', () => {
  let component: TeleChatComponent;
  let fixture: ComponentFixture<TeleChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
