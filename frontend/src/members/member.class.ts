module members {

  export class Member {
    id: string;
    name: string;
    email: string;
    birthYear: number;

    constructor(memberData: any) {
      this.id = memberData._id || memberData.id;
      this.name = memberData.name;
      this.email = memberData.email;
      this.birthYear = memberData.birthYear
    }
  }
}
