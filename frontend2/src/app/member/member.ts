export interface Member {
  id?: string;
  number: string;
  name: string;
  email: string;
  email2?: string;
  familyMembershipNumber?: string;
  birthDate?: string;
  hasOutstandingMembershipPayment: boolean;
  startDate: string;
  terminationDate?: string;
  team: number,
  gender: number
}
