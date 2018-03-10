import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberOutstandingSubscriptionComponent } from './member-outstanding-subscription.component';

describe('MemberOutstandingSubscriptionComponent', () => {
  let component: MemberOutstandingSubscriptionComponent;
  let fixture: ComponentFixture<MemberOutstandingSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberOutstandingSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberOutstandingSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
