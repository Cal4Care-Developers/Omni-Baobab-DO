import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WpInstComposeComponent } from './wp-inst-compose.component';

describe('WpInstComposeComponent', () => {
  let component: WpInstComposeComponent;
  let fixture: ComponentFixture<WpInstComposeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WpInstComposeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WpInstComposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
