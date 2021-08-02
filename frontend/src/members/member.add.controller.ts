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
    templates: any;

    disableSubmitButton: boolean = false;

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

      this.MembersService.getWelcomeMessageTemplates().then((response) => {
        this.templates = response.templates;
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

      if (!member.phone) {
        this.errorMessage = 'Du kan ikke oprette et medlem uden kontakt telefonnummer';
        return;
      }

      if (!this.form.inputBirthDate.$valid) {
        this.errorMessage = 'Fødselsdatoen skal være i formatet: åååå-mm-dd';
        return;
      }

      this.disableSubmitButton = true;

      member.team = this.selectedTeam ? parseInt(this.selectedTeam) : null;
      member.gender = this.selectedGender ? parseInt(this.selectedGender) : null;

      const request: AddMemberRequest = {
        member: member,
        welcomeMessage: {
          send: this.sendWelcomeMessageOnCreation,
          subject: this.welcomeMessageSubject,
          template: this.welcomeMessageTemplate,
        },
      };

      this.MembersService.add(request)
        .then((response) => {
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
        .catch((err) => {
          toastr.error(err);
        })
        .finally(() => {
          this.disableSubmitButton = false;
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
              },
            },
          })
          .result.then((changeTemplate: boolean) => {
            if (changeTemplate) {
              this.welcomeMessageTemplate = this.getWelcomeMessageTemplate(team);
            }
          })
          .catch((err) => {
            toastr.error(err.statusText, err.status);
          });
        return;
      } else {
        this.welcomeMessageTemplate = this.getWelcomeMessageTemplate(team);
      }
    }

    getWelcomeMessageTemplate(team: string) {
      switch (team) {
        case '1':
          return this.templates.Miniholdet;
        case '2':
          return this.templates.Mellemholdet;
        case '3':
          return this.templates.Storeholdet;
        case '4':
          return this.templates.Voksenholdet;
        case '5':
          return this.templates.TrackFit;
        default:
          return '';
      }
    }
  }
}

angular.module('members').controller('MemberAddController', members.MemberAddController);
