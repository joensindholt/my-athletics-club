module members {

  export class Member {
    id: string;
    number: string;
    name: string;
    email: string;
    email2: string;
    familyMembershipNumber: string;
    birthDate: string;

    constructor(memberData: any) {
      this.id = memberData._id || memberData.id;
      this.number = memberData.number;
      this.name = memberData.name;
      this.email = memberData.email;
      this.email2 = memberData.email2;
      this.familyMembershipNumber = memberData.familyMembershipNumber;
      this.birthDate = memberData.birthDate
    }
  }
}
