import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EventListLayoutComponent } from "./event-list-layout.component";

describe("EventListLayoutComponent", () => {
  let component: EventListLayoutComponent;
  let fixture: ComponentFixture<EventListLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventListLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventListLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
