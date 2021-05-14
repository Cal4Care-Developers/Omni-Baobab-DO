import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposeWpComponent } from './compose-wp.component';

describe('ComposeWpComponent', () => {
  let component: ComposeWpComponent;
  let fixture: ComponentFixture<ComposeWpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComposeWpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposeWpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
