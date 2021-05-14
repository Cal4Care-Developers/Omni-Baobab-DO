import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuxCodeComponent } from './aux-code.component';

describe('AuxCodeComponent', () => {
  let component: AuxCodeComponent;
  let fixture: ComponentFixture<AuxCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuxCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuxCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
