import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkMailListComponent } from './bulk-mail-list.component';

describe('BulkMailListComponent', () => {
  let component: BulkMailListComponent;
  let fixture: ComponentFixture<BulkMailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkMailListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkMailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
