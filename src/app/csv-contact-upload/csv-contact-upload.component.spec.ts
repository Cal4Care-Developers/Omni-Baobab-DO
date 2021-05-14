import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvContactUploadComponent } from './csv-contact-upload.component';

describe('CsvContactUploadComponent', () => {
  let component: CsvContactUploadComponent;
  let fixture: ComponentFixture<CsvContactUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvContactUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvContactUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
