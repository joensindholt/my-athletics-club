using System;
using System.ComponentModel.DataAnnotations;

namespace MyAthleticsClub.Core.Members
{
  public enum Team { Miniholdet = 1, Mellemholdet = 2, Storeholdet = 3, Voksenatletik = 4 }

  public enum Gender { Female = 1, Male = 2 }

  public class Member : IEntityObject
  {
    public string OrganizationId { get; set; }

    public string Id { get; set; }

    public string Number { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public string Email { get; set; }

    public string Email2 { get; set; }

    public string FamilyMembershipNumber { get; set; }

    public DateTime? BirthDate { get; set; }

    public bool HasOutstandingMembershipPayment { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? TerminationDate { get; set; }

    public Team? Team { get; set; }

    public Gender? Gender { get; set; }

    public Member()
    {
    }

    public Member(
        string organizationId,
        string id,
        string number,
        string name,
        string email,
        string email2,
        string familyMembershipNumber,
        DateTime? birthDate,
        bool hasOutstandingMembershipPayment,
        DateTime? terminationDate,
        DateTime? startDate,
        Team? team,
        Gender? gender)
    {
      OrganizationId = organizationId;
      Id = id;
      Number = number;
      Name = name;
      Email = email;
      Email2 = email2;
      FamilyMembershipNumber = familyMembershipNumber;
      BirthDate = birthDate;
      HasOutstandingMembershipPayment = hasOutstandingMembershipPayment;
      TerminationDate = terminationDate;
      StartDate = startDate;
      Team = team;
      Gender = gender;
    }

    public string GetPartitionKey()
    {
      return OrganizationId;
    }

    public string GetRowKey()
    {
      return Id;
    }

    public int GetAge(DateTime reference)
    {
      if (!BirthDate.HasValue)
      {
        throw new Exception($"No birthdate registered for member '${Name}'");
      }

      int age = reference.Year - BirthDate.Value.Year;
      if (reference < BirthDate.Value.AddYears(age)) age--;

      return age;
    }

    public int GetMonthsMembershipInYear(int year)
    {
      int monthsMembership = 0;

      for (var month = 1; month <= 12; month++)
      {
        var monthStart = new DateTime(year, month, 1);
        var monthEnd = new DateTime(year, month + 1, 1).AddDays(-1);

        if (StartDate <= monthStart && (TerminationDate == null || TerminationDate >= monthEnd))
        {
          monthsMembership++;
        }
      }

      return monthsMembership;
    }
  }
}
