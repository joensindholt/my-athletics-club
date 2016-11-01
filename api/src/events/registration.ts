export enum Gender { female, male }

export interface IRegistration {
  "eventId": string,
  "name": string,
  "email": string,
  "ageClass": string,
  "disciplines": [{
    "id": string,
    "name": string,
    "personalRecord": string
  }],
  "extraDisciplines": [{
    "id": string,
    "name": string,
    "personalRecord": string
    "ageClass": string,
  }],
  "recaptcha": string
}
