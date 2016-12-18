import { FormsModule } from '@angular/forms';
import {
  async,
  TestBed
 } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';

import { MembersComponent } from './members.component';
import { MemberService } from '../shared/index';

export function main() {
  describe('Members component', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [MembersComponent],
        providers: [
          { provide: MemberService, useValue: new MockMemberService() }
        ]
      });

    });

    it('should work',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(MembersComponent);
            let membersInstance = fixture.debugElement.componentInstance;
            let membersDOMEl = fixture.debugElement.nativeElement;
            let mockMemberService = <MockMemberService>fixture.debugElement.injector.get(MemberService);
            let memberServiceSpy = spyOn(mockMemberService, 'get').and.callThrough();

            mockMemberService.returnValue = [{name: 'Hans'}];

            fixture.detectChanges();

            expect(membersInstance.memberService).toEqual(jasmine.any(MockMemberService));
            expect(membersDOMEl.querySelectorAll('li').length).toEqual(1);
            expect(memberServiceSpy.calls.count()).toBe(1);
          });

      }));
  });
}

class MockMemberService {

  returnValue: Array<any>;

  get(): Observable<string[]> {
    return Observable.create((observer: any) => {
      observer.next(this.returnValue);
      observer.complete();
    });
  }
}
