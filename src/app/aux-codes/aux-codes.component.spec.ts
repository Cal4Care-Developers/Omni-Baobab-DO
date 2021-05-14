import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuxCodesComponent } from './aux-codes.component';

describe('AuxCodesComponent', () => {
  let component: AuxCodesComponent;
  let fixture: ComponentFixture<AuxCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuxCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuxCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
