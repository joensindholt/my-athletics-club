module events {

  export class Event {
    id: string;
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
    info: string;
    registrationsStatus: string; // Client only property
    registrations: Array<Registration>; // Client only property
    isOpenForRegistration: boolean;
    isOldEvent: boolean;
    maxDisciplinesAllowed: number;

    constructor(eventData: any, dateService: core.DateService) {
      this.id = eventData._id || eventData.id || -1;
      this.title = eventData.title || 'Nyt stævne';
      console.log('parsing date with explicit timezone added: ' + eventData.date);
      this.date = eventData.date ? dateService.parseDateAsCopenhagenTime(eventData.date) : new Date();
      console.log(this.date, this.date.toLocaleString());
      this.address = eventData.address || 'Ved Stadion 6\n2820 Gentofte';
      this.link = eventData.link;
      this.disciplines = eventData.disciplines || [];
      this.info = eventData.info;
      this.maxDisciplinesAllowed = eventData.maxDisciplinesAllowed || 3;
      this.isOldEvent = eventData.isOldEvent;

      this.registrationPeriodStartDate = null;
      if (eventData.registrationPeriodStartDate) {
        this.registrationPeriodStartDate = dateService.parseDateAsCopenhagenTime(eventData.registrationPeriodStartDate);
      }

      this.registrationPeriodEndDate = null;
      if (eventData.registrationPeriodEndDate) {
        this.registrationPeriodEndDate = dateService.parseDateAsCopenhagenTime(eventData.registrationPeriodEndDate);
      }

      // reset time on dates 
      if (this.date) {
        this.date = this.resetTimePart(this.date);
      }
      if (this.registrationPeriodStartDate) {
        this.registrationPeriodStartDate = this.resetTimePart(this.registrationPeriodStartDate);
      }
      if (this.registrationPeriodEndDate) {
        this.registrationPeriodEndDate = this.resetTimePart(this.registrationPeriodEndDate);
      }

      // is event open for registration?
      if (this.registrationPeriodEndDate && this.registrationPeriodStartDate) {
        var now = new Date();
        var registrationPeriodEndDateOffset = new Date(this.registrationPeriodEndDate.getTime());
        registrationPeriodEndDateOffset.setDate(registrationPeriodEndDateOffset.getDate() + 1);
        this.isOpenForRegistration = this.registrationPeriodStartDate <= now && now <= registrationPeriodEndDateOffset;
      }
      else {
        this.isOpenForRegistration = false;
      }
    }

    resetTimePart(date: Date) {
      date.setHours(0, 0, 0, 0);
      return date;
    }
  }
}
