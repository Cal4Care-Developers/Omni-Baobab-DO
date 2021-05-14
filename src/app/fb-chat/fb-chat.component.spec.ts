import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbChatComponent } from './fb-chat.component';

describe('FbChatComponent', () => {
  let component: FbChatComponent;
  let fixture: ComponentFixture<FbChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
