module events {

  export class Event {
    _id: string;
    title: string;
    date: Date;
    address: string;
    link: string;
    disciplines: Array<{
      ageGroup: string,
      disciplines: Array<{
        id: string,
        name: string
      }>
    }>;
    registrationPeriodStartDate: Date;
    registrationPeriodEndDate: Date;

    constructor(eventData: any) {
      this._id = eventData._id || -1;
      this.title = eventData.title || 'Nyt stævne';
      this.date = eventData.date ? new Date(eventData.date) : new Date();
      this.address = eventData.address || 'Ved Stadion 6\n2820 Gentofte';
      this.link = eventData.link;
      this.disciplines = eventData.disciplines || [];

      if (eventData.registrationPeriodStartDate) {
        this.registrationPeriodStartDate = new Date(eventData.registrationPeriodStartDate);
      }
      else {
        this.registrationPeriodStartDate = new Date(this.date.getTime() - 30 * 86400000);
      }

      if (eventData.registrationPeriodEndDate) {
        this.registrationPeriodEndDate = new Date(eventData.registrationPeriodEndDate);
      } else {
        this.registrationPeriodEndDate = new Date(this.date.getTime() - 14 * 86400000);
      }

      // reset time on dates 
      this.date = this.resetTimePart(this.date);
      this.registrationPeriodStartDate = this.resetTimePart(this.registrationPeriodStartDate);
      this.registrationPeriodEndDate = this.resetTimePart(this.registrationPeriodEndDate);
    }

    resetTimePart(date: Date) {
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }
}
