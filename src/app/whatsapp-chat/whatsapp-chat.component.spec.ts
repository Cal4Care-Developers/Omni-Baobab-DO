import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappChatComponent } from './whatsapp-chat.component';

describe('WhatsappChatComponent', () => {
  let component: WhatsappChatComponent;
  let fixture: ComponentFixture<WhatsappChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsappChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
