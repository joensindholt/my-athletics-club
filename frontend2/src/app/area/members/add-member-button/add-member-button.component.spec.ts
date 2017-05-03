import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberButtonComponent } from './add-member-button.component';

describe('AddMemberButtonComponent', () => {
  let component: AddMemberButtonComponent;
  let fixture: ComponentFixture<AddMemberButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMemberButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemberButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
