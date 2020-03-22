using MediatR;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using MyAthleticsClub.Api.Application;
using MyAthleticsClub.Api.Application.Common.Interfaces;
using MyAthleticsClub.Api.Application.Features.Members.CreateMember;
using MyAthleticsClub.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MyAthleticsClub.Api.Tests.IntegrationTests
{
    public abstract class IntegrationTest
    {
        protected static IMediator mediator = null!;
        protected static Mock<IAzureTableStorageRepository> tableStorageRepositoryMock = null!;

        public IntegrationTest()
        {
            if (mediator == null)
            {
                var services = new ServiceCollection();

                // We add the real application services
                services.AddApplication();

                // But we mock infrastructure services. We do not want to really access the database or services like it
                services.AddSingleton((System.Func<System.IServiceProvider, IApplicationDbContext>)(provider =>
                {
                    var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase("Fake");

                    tableStorageRepositoryMock = new Mock<IAzureTableStorageRepository>();
                    var applicationDbContext = new ApplicationDbContext(
                        optionsBuilder.Options,
                        tableStorageRepositoryMock.Object);

                    return applicationDbContext;
                }));

                // We need to manually add the fluent validators one by one
                services.AddTransient<IValidator<CreateMemberRequest>, CreateMemberRequestValidator>();

                // Create a service provider
                var serviceProvider = services.BuildServiceProvider();

                // Get the mediator instance for use in inheriting tests
                mediator = serviceProvider.GetService<IMediator>();
            }
        }
    }
}