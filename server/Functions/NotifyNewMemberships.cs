using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Hosting;
using Microsoft.Extensions.Logging;
using MyAthleticsClub.Server.Models;

[assembly: WebJobsStartup(typeof(MyAthleticsClub.Server.Startup))]

namespace MyAthleticsClub.Server.Functions
{
    /// <summary>
    /// 14 days after a new member is registered a notification should be sent
    /// to the GIK accountant telling him/her to check whether or not the subscription
    /// has been paid
    /// </summary>
    public class NotifyNewMemberships
    {
        private readonly DataStore _dataStore;

        public NotifyNewMemberships(DataStore dataStore)
        {
            _dataStore = dataStore;
        }

        [FunctionName("NotifyNewMemberships")]
        public async Task Run([TimerTrigger("0 17 * * *")]TimerInfo myTimer, ILogger logger)
        {
            logger.LogInformation($"Notifying accountant about new members");
            
            var members = await GetMembers();

            logger.LogInformation($"Found {members.Count()} members");
            
            if (members.Any())
            {
                var message = CreateMessage(members);
                await SendMessage(message);
            }            
        }

        private async Task<IEnumerable<Member>> GetMembers()
        {
            throw new NotImplementedException();
        }
    }
}
