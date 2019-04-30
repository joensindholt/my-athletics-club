using System;
using System.Collections.Generic;
using System.Linq;
using MyAthleticsClub.Core.Members;

namespace MyAthleticsClub.Core.Subscriptions
{
  public abstract class Subscription
  {
    public string Id { get; set; }

    public string Title { get; set; }

    public string Email { get; set; }

    public abstract decimal Price();

    public IEnumerable<SubscriptionAccountPosting> Postings { get; set; }

    public int? LastReminder { get; set; }

    public DateTime? LastReminderDate { get; set; }

    public Subscription(string id, string title, string email)
    {
      Id = id;
      Title = title;
      Email = email;
    }

    public decimal GetBalance()
    {
      return Postings.Sum(p => p.Amount);
    }

    public DateTimeOffset? GetLatestInvoiceDate()
    {
      return
          Postings
              .Where(p => p.Amount < 0)
              .OrderByDescending(p => p.InvoiceDate)
              .FirstOrDefault()?.InvoiceDate;
    }

    public int? GetReminder()
    {
      // do the subscriber owe us money - if not do not send reminder
      if (GetBalance() >= 0)
      {
        return null;
      }

      // have we sent out invoice at all - if not do not send out reminder
      var latestInvoiceDate = GetLatestInvoiceDate();
      if (!latestInvoiceDate.HasValue)
      {
        return null;
      }

      // base the next reminder on the rules:
      // 1.rykker, hvis vi ikke har modtaget penge 16 dage efter opkrævning
      // 2.rykker, hvis vi ikke har modtaget pengene 10 dage efter 1.rykker
      // 3. (og sidste) rykker hvis vi ikke har modtaget pengene 10 dage efter 2.rykker

      // TODO: Make second and third reminder relative to first and second reminder instead of invoice date
      switch (LastReminder)
      {
        case null:
          // First reminder
          return DateTime.UtcNow > latestInvoiceDate.Value.UtcDateTime.AddDays(16) ? (int?)1 : null;

        case 1:
          // Second reminder
          return DateTime.UtcNow > latestInvoiceDate.Value.UtcDateTime.AddDays(26) ? (int?)2 : null;

        case 2:
          // Thirds reminder
          return DateTime.UtcNow > latestInvoiceDate.Value.UtcDateTime.AddDays(36) ? (int?)3 : null;

        default:
          return null;
      }
    }

    public void RegisterReminder(int? reminder)
    {
      LastReminder = reminder;
      LastReminderDate = DateTime.UtcNow;
    }
  }

  public abstract class SingleMemberSubscription : Subscription
  {
    public SingleMemberSubscription(string memberId, string memberName, string memberEmail)
        : base(memberId, memberName, memberEmail)
    {
    }
  }

  public class MiniSubscription : SingleMemberSubscription
  {
    public MiniSubscription(string memberId, string memberName, string memberEmail) : base(
        memberId: memberId,
        memberName: memberName,
        memberEmail: memberEmail
    )
    {
    }

    public override decimal Price()
    {
      return 1000;
    }
  }

  public class MellemSubscription : SingleMemberSubscription
  {
    public MellemSubscription(string memberId, string memberName, string memberEmail) : base(
        memberId: memberId,
        memberName: memberName,
        memberEmail: memberEmail
    )
    {
    }

    public override decimal Price()
    {
      return 1200;
    }
  }

  public class StoreSubscription : SingleMemberSubscription
  {
    public StoreSubscription(string memberId, string memberName, string memberEmail) : base(
        memberId: memberId,
        memberName: memberName,
        memberEmail: memberEmail
    )
    {
    }

    public override decimal Price()
    {
      return 1200;
    }
  }

  public class VoksenatletikSubscription : SingleMemberSubscription
  {
    public VoksenatletikSubscription(string memberId, string memberName, string memberEmail) : base(
        memberId: memberId,
        memberName: memberName,
        memberEmail: memberEmail
    )
    {
    }

    public override decimal Price()
    {
      return 600;
    }
  }

  public class FamilySubscription : Subscription
  {
    public FamilySubscription(string familyMembershipNumber, string email) : base(
        id: "family_" + familyMembershipNumber,
        title: "Familiemedlemskab " + familyMembershipNumber,
        email: email
    )
    {
    }

    public override decimal Price()
    {
      return 2000;
    }
  }

  public class SubscriptionFactory
  {
    public static Subscription CreateSubscription(Member member)
    {
      if (!string.IsNullOrWhiteSpace(member.FamilyMembershipNumber))
      {
        return new FamilySubscription(member.FamilyMembershipNumber, member.Email);
      }

      switch (member.Team)
      {
        case Team.Miniholdet:
          return new MiniSubscription(member.Id, member.Name, member.Email);

        case Team.Mellemholdet:
          return new MellemSubscription(member.Id, member.Name, member.Email);

        case Team.Storeholdet:
          return new StoreSubscription(member.Id, member.Name, member.Email);

        case Team.Voksenatletik:
          return new VoksenatletikSubscription(member.Id, member.Name, member.Email);

        default:
          throw new Exception("Unknown team type: " + member.Team.ToString());
      }
    }
  }
}
