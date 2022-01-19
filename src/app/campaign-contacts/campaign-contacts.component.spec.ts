import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignContactsComponent } from './campaign-contacts.component';

describe('CampaignContactsComponent', () => {
  let component: CampaignContactsComponent;
  let fixture: ComponentFixture<CampaignContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
