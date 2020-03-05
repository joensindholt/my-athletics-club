module members {
  export class GetMemberResponse {
    constructor(data: any) {
      this.member = new Member(data.member);
      this.messages = data.messages.map(m => new MemberMessage(m));
    }

    member: Member;
    messages: Array<MemberMessage>;
  }
}
