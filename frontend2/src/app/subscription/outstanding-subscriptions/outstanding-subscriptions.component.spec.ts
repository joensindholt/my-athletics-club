import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { OutstandingSubscriptionComponent } from "./outstanding-subscriptions.component";

describe("MemberOutstandingSubscriptionComponent", () => {
  let component: OutstandingSubscriptionComponent;
  let fixture: ComponentFixture<OutstandingSubscriptionComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [OutstandingSubscriptionComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
