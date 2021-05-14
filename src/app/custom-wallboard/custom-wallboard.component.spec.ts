import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomWallboardComponent } from './custom-wallboard.component';

describe('CustomWallboardComponent', () => {
  let component: CustomWallboardComponent;
  let fixture: ComponentFixture<CustomWallboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomWallboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomWallboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
