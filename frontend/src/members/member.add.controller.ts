/// <reference path="../../typings/tsd.d.ts"/>

module members {
  'use strict';

  export class MemberAddController {
    form: any;
    member: Member = new Member({});
    errorMessage: string;
    birthYears: Array<number>;

    selectableTeams: Array<{ id: number; label: string }>;
    selectedTeam: string;
    selectableGenders: Array<{ id: number; label: string }>;
    selectedGender: string;

    sendWelcomeMessageOnCreation: boolean = true;
    welcomeMessageSubject: string = 'Velkommen til GIK Atletik';
    welcomeMessageTemplate: string;
    welcomeMessageChangedByUser: boolean;

    static $inject = ['$scope', '$state', '$window', '$q', 'moment', '$uibModal', 'MembersService', 'AuthService'];

    constructor(
      private $scope: ng.IScope,
      private $state,
      private $window: ng.IWindowService,
      private $q: ng.IQService,
      private moment: moment.MomentStatic,
      private $uibModal,
      private MembersService: MembersService,
      private AuthService: users.AuthService
    ) {
      this.birthYears = this.MembersService.getAllowedBirthYears();
      this.selectableTeams = this.MembersService.getTeamInfos();
      this.selectableGenders = this.MembersService.getGenderInfos();

      this.member.startDate = moment(new Date()).format('YYYY-MM-DD');

      this.welcomeMessageTemplate = this.getWelcomeMessageTemplate(null);

      this.$scope.$on('family-membership-number-found', ($event, number) => {
        this.member.familyMembershipNumber = number;
      });
    }

    addMember(member: Member) {
      if (!member.name) {
        this.errorMessage = 'Du kan ikke oprette et medlem uden navn';
        return;
      }

      if (!member.email) {
        this.errorMessage = 'Du kan ikke oprette et medlem uden email-adresse';
        return;
      }

      if (!this.form.inputBirthDate.$valid) {
        this.errorMessage = 'Fødselsdatoen skal være i formatet: åååå-mm-dd';
        return;
      }

      member.team = this.selectedTeam ? parseInt(this.selectedTeam) : null;
      member.gender = this.selectedGender ? parseInt(this.selectedGender) : null;

      const request: AddMemberRequest = {
        member: member,
        welcomeMessage: {
          send: this.sendWelcomeMessageOnCreation,
          subject: this.welcomeMessageSubject,
          template: this.welcomeMessageTemplate
        }
      };

      this.MembersService.add(request)
        .then(response => {
          if (request.welcomeMessage.send) {
            if (!response.welcomeMessageSent) {
              toastr.warning('Der blev ikke sendt en velkomstmail til medlemmet pga. en fejl');
            } else if (!response.welcomeMessageRegistered) {
              toastr.warning(
                'Det blev, pga. en fejl, ikke registreret i systemet, at medlemmet fik tilsendt ' +
                  'en velkomstmail og vil derfor ikke fremgå af medlemmets udbakke'
              );
            }
          }

          const message = 'Medlemmet er oprettet med medlemsnummer ' + response.member.number;
          toastr.success(message);

          setTimeout(() => this.$state.go('members'), 1000);
        })
        .catch(err => {
          toastr.error(err);
        });
    }

    handleSelectedTeamChanged(team: string) {
      if (this.welcomeMessageChangedByUser) {
        this.$uibModal
          .open({
            templateUrl: 'members/modals/member.add.template-changed.modal.controller.html',
            controller: 'MemberAddTemplateChangedModalController',
            controllerAs: 'vm',
            resolve: {
              context: () => {
                return {};
              }
            }
          })
          .result.then((changeTemplate: boolean) => {
            if (changeTemplate) {
              this.welcomeMessageTemplate = this.getWelcomeMessageTemplate(team);
            }
          })
          .catch(err => {
            toastr.error(err.statusText, err.status);
          });
        return;
      } else {
        this.welcomeMessageTemplate = this.getWelcomeMessageTemplate(team);
      }
    }

    getWelcomeMessageTemplate(team: string) {
      switch (team) {
        case '2': // Mellemholdet
          return `**Velkommen til GIK Atletik :)**
            
{{member_name}} er nu indmeldt i klubben på Mellemholdet, der træner onsdag fra 17-18:30. For atleter i 
alderen 9+ år, trænes der endvidere mandag fra 18-19:30. Træningen foregår begge dage på atletikbanen 
ved Stadion.

Kontingentet for medlemsskabet lyder på 1300 kr for en sæson, og det bedes indbetalt senest 
{{latest_payment_date}} på vores konto:

regnr.: 1551<br/>
kontonr.: 0004062434

Angiv venligst medlemsnummer {{member_number}} på indbetalingen, så indbetalingen bliver 
registreret korrekt.

Hvis I har nogle spørgsmål, er I velkommen til at kontakte GIK på denne mail, så vil vi hjælpe efter 
bedste evne :)

Mvh<br/>
GIK Atletik`;
        case '3': // Storeholdet
          return `**Velkommen til GIK Atletik :)**

{{member_name}} er nu indmeldt i klubben på Storeholdet, der træner mandag, onsdag og torsdag fra 18-19:30. 
Træningen foregår alle dage på atletikbanen ved Stadion.

Kontingentet for medlemsskabet lyder på 1500 kr for en sæson, og det bedes indbetalt senest 
{{latest_payment_date}} på vores konto:

regnr.: 1551<br/>
kontonr.: 0004062434

Angiv venligst medlemsnummer {{member_number}} på indbetalingen, så indbetalingen bliver registreret korrekt.

Hvis I har nogle spørgsmål, er I velkommen til at kontakte GIK på denne mail, så vil vi hjælpe efter bedste evne :)

Mvh<br/>
GIK Atletik`;
        case '4': // Voksenatletik
          return `**Velkommen til GIK Atletik :)**

Du er nu indmeldt i klubben og kan deltage i Voksenatletik.

Kontingentet for medlemsskabet lyder på 600 kr for en sæson, og det bedes indbetalt senest {{latest_payment_date}} 
på vores konto:

regnr.: 1551<br/>
kontonr.: 0004062434

Angiv venligst medlemsnummer {{member_number}} på indbetalingen, så indbetalingen bliver registreret korrekt.

Hvis du har nogle spørgsmål, er du velkommen til at kontakte GIK på denne mail, så vil vi hjælpe efter bedste evne :)

Mvh<br/>
GIK Atletik`;
        default:
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
  }
}

angular.module('members').controller('MemberAddController', members.MemberAddController);
