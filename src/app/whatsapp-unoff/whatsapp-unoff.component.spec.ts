import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappUnoffComponent } from './whatsapp-unoff.component';

describe('WhatsappUnoffComponent', () => {
  let component: WhatsappUnoffComponent;
  let fixture: ComponentFixture<WhatsappUnoffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsappUnoffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappUnoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
