using Microsoft.Extensions.Logging;

namespace MyAthleticsClub.Core.BackgroundJobs
{
    public class BackgroundJobServiceMock : IBackgroundJobService
    {
        private readonly ILogger<BackgroundJobServiceMock> _logger;

        public BackgroundJobServiceMock(ILogger<BackgroundJobServiceMock> logger)
        {
            _logger = logger;
        }

        public void Initialize()
        {
            _logger.LogInformation("Initialized mocked background service");
        }
    }
}
