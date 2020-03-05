module members {
  export interface AddMemberRequest {
    member: Member;
    welcomeMessage: {
      send: boolean;
      subject: string;
      template: string;
    };
  }
}
