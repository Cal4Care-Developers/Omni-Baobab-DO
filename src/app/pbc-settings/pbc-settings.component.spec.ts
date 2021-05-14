import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PbcSettingsComponent } from './pbc-settings.component';

describe('PbcSettingsComponent', () => {
  let component: PbcSettingsComponent;
  let fixture: ComponentFixture<PbcSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PbcSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PbcSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
