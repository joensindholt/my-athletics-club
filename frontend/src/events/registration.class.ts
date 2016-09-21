module events {

    export class Registration {
        _id: string;
        eventId: string;
        name: string;
        gender: string;
        email: string;
        birthYear: number;
        recaptcha: any;
        disciplines: Array<{
            id: string,
            name: string,
            personalRecord: string
        }>;

        constructor(registrationData: any) {
            this._id = registrationData._id;
            this.eventId = registrationData.eventId;
            this.name = registrationData.name;
            this.gender = registrationData.gender;
            this.email = registrationData.email;
            this.birthYear = registrationData.birthYear;
            this.disciplines = registrationData.disciplines;
        }
    }

}
