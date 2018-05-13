export class Subscription {
  id: string;
  title: string;
  price: number;
  balance: number;
  reminder?: number;
  lastReminder?: number;
  latestInvoiceDate: string;
}
