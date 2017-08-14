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
    terminationDate: string;
    startDate: string;
    team: number;
    gender: number;

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
      this.terminationDate = memberData.terminationDate;
      
      this.startDate = memberData.startDate;
      // Get date part only from start date 
      if (this.startDate && this.startDate.length > 10) {
        this.startDate = this.startDate.substring(0, 10);
      }

      this.team = memberData.team;
      this.gender = memberData.gender;
    }
  }
}
