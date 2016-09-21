module members {

    export class Member {
        _id: string;
        name: string;
        email: string;
        birthYear: number;

        constructor(memberData: any) {
            this._id = memberData._id;
            this.name = memberData.name;
            this.email = memberData.email;
            this.birthYear = memberData.birthYear
        }
    }
}
