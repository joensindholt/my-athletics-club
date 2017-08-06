module members {

  export class Member {
    id: string;
    number: string;
    name: string;
    email: string;
    email2: string;
    familyMembershipNumber: string;
    birthDate: string;
    hasOutstandingMembershipPayment: boolean;

    constructor(memberData: any) {
      this.id = memberData._id || memberData.id;
      this.number = memberData.number;
      this.name = memberData.name;
      this.email = memberData.email;
      this.email2 = memberData.email2;
      this.familyMembershipNumber = memberData.familyMembershipNumber;
      this.birthDate = memberData.birthDate;

      // Get date part only from birth date 
      if (this.birthDate && this.birthDate.length > 10) {
        this.birthDate = this.birthDate.substring(0, 10);
      }

      this.hasOutstandingMembershipPayment = memberData.hasOutstandingMembershipPayment
    }
  }
}
