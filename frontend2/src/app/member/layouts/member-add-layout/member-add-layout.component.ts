import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-member-add-layout',
  templateUrl: './member-add-layout.component.html',
  styleUrls: ['./member-add-layout.component.scss'],
})
export class MemberAddLayoutComponent {
  formArray = this.fb.array([
    this.fb.group({
      name: [null, Validators.required],
      email: [null, Validators.required],
      email2: [null],
      gender: [null, Validators.required],
      birthDate: [null],
      team: [null, Validators.required],
      startDate: [null, Validators.required],
    }),
    this.fb.group({
      welcomeNotificationEnabled: [true],
      welcomeNotificationSubject: ['Velkommen til GIK Atletik'],
      welcomeNotificationText: [this.getWelcomeMessageTemplate()],
    }),
  ]);

  memberForm = this.fb.group({
    formArray: this.formArray,
  });

  teams = [
    { name: 'Miniholdet', value: '1' },
    { name: 'Mellemholdet', value: '2' },
    { name: 'Storeholdet', value: '3' },
    { name: 'Voksenatletik', value: '4' },
  ];

  genders = [
    { name: 'Pige', value: '1' },
    { name: 'Dreng', value: '1' },
  ];

  constructor(private fb: FormBuilder) {
    console.log('f', this.formArray);
  }

  onSubmit() {
    alert('Thanks!');
  }

  getWelcomeMessageTemplate() {
    return `**Velkommen til GIK Atletik :)**

Du er nu indmeldt i klubben.

Kontingentet for medlemsskabet bedes indbetalt senest {{latest_payment_date}} på vores konto:

regnr.: 1551<br/>
kontonr.: 0004062434

Angiv venligst medlemsnummer {{member_number}} på indbetalingen, så indbetalingen bliver registreret korrekt.

Hvis du har nogle spørgsmål, er du velkommen til at kontakte GIK på denne mail, så vil vi hjælpe efter bedste evne :)

Mvh<br/>
GIK Atletik`;
  }
}
