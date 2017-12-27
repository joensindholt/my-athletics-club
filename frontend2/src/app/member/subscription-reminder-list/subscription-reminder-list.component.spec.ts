import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionReminderListComponent } from './subscription-reminder-list.component';

describe('SubscriptionReminderListComponent', () => {
  let component: SubscriptionReminderListComponent;
  let fixture: ComponentFixture<SubscriptionReminderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionReminderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionReminderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
