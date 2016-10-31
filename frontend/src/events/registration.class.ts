module events {

  export class Registration {
    eventId: string;
    name: string;
    email: string;
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

    // constructor(registrationData: any) {
    //   this._id = registrationData._id;
    //   this.eventId = registrationData.eventId;
    //   this.name = registrationData.name;
    //   this.gender = registrationData.gender;
    //   this.email = registrationData.email;
    //   this.birthYear = registrationData.birthYear;
    //   this.disciplines = registrationData.disciplines || [];
    //   this.extraDisciplines = registrationData.extraDisciplines || [];
    // }
  }

}
