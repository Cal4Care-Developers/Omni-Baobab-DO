import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotQuestionFeedComponent } from './chatbot-question-feed.component';

describe('ChatbotQuestionFeedComponent', () => {
  let component: ChatbotQuestionFeedComponent;
  let fixture: ComponentFixture<ChatbotQuestionFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatbotQuestionFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatbotQuestionFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
