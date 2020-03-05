module members {
  export class MemberMessage {
    id: string;
    memberId: string;
    to: string;
    subject: string;
    htmlContent: string;
    sent: string;

    constructor(data: any) {
      this.id = data.id;
      this.memberId = data.memberId;
      this.to = data.to;
      this.subject = data.subject;
      this.htmlContent = data.htmlContent;
      this.sent = data.sent;
    }
  }
}
