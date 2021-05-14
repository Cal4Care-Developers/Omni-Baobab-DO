import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbootAiComponent } from './chatboot-ai.component';

describe('ChatbootAiComponent', () => {
  let component: ChatbootAiComponent;
  let fixture: ComponentFixture<ChatbootAiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatbootAiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatbootAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
