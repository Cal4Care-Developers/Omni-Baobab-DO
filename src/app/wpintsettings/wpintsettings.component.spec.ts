import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WpintsettingsComponent } from './wpintsettings.component';

describe('WpintsettingsComponent', () => {
  let component: WpintsettingsComponent;
  let fixture: ComponentFixture<WpintsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WpintsettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WpintsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
