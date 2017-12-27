export interface Subscription {
  id: string;
  title: string;
  price: number;
  balance: number;
  reminder?: number;
  lastReminder?: number;
  latestInvoiceDate: string;
}
