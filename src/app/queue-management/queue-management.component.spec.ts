import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueManagementComponent } from './queue-management.component';

describe('QueueManagementComponent', () => {
  let component: QueueManagementComponent;
  let fixture: ComponentFixture<QueueManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
