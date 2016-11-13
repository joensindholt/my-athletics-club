module events {

  export class Registration {
    _id: string;
    eventId: string;
    name: string;
    email: string;
    birthYear: string;
    ageClass: string;
    recaptcha: any;
    disciplines: Array<{
      id: string,
      name: string,
      personalRecord: string
    }>;
    extraDisciplines: Array<{
      id?: string,
      ageClass?: string,
      name?: string,
      personalRecord?: string
    }>;

    constructor(registrationData: any) {
      this._id = registrationData._id;
      this.eventId = registrationData.eventId;
      this.name = registrationData.name;
      this.email = registrationData.email;
      this.birthYear = registrationData.birthYear;
      this.ageClass = registrationData.ageClass;
      this.disciplines = registrationData.disciplines || [];
      this.extraDisciplines = registrationData.extraDisciplines || [];
    }
  }
}
