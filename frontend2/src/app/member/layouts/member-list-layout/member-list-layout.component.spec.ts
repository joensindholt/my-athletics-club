import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MemberListLayoutComponent } from "./member-list-layout.component";

describe("MemberListLayoutComponent", () => {
  let component: MemberListLayoutComponent;
  let fixture: ComponentFixture<MemberListLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MemberListLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberListLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
