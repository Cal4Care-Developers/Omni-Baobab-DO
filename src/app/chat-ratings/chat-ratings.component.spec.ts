import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRatingsComponent } from './chat-ratings.component';

describe('ChatRatingsComponent', () => {
  let component: ChatRatingsComponent;
  let fixture: ComponentFixture<ChatRatingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatRatingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
