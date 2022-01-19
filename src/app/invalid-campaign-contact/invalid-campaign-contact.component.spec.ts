import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidCampaignContactComponent } from './invalid-campaign-contact.component';

describe('InvalidCampaignContactComponent', () => {
  let component: InvalidCampaignContactComponent;
  let fixture: ComponentFixture<InvalidCampaignContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvalidCampaignContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidCampaignContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
