import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalChatComponent } from './internal-chat.component';

describe('InternalChatComponent', () => {
  let component: InternalChatComponent;
  let fixture: ComponentFixture<InternalChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
