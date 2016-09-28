export enum Gender { female, male }

export interface IRegistration {
  eventId: string,
  name: string,
  gender: Gender,
  email: string,
  birthYear: number,
  recaptcha: any;
  disciplines: Array<any>;
}
