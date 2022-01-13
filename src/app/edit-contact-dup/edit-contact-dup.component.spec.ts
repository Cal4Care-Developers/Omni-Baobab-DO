import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContactDupComponent } from './edit-contact-dup.component';

describe('EditContactDupComponent', () => {
  let component: EditContactDupComponent;
  let fixture: ComponentFixture<EditContactDupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditContactDupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContactDupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
