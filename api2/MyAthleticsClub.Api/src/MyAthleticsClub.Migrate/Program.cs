﻿using System;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using MongoDB.Driver;
using MyAthleticsClub.Migrate.Repositories;

namespace MyAthleticsClub.Migrate
{
    public class Program
    {
        public static void Main(string[] args)
        {
            MainAsync(args).Wait();
        }

        private static async Task MainAsync(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;

            var accountName = Environment.GetEnvironmentVariable("AZURE_ACCOUNT_NAME");
            var keyValue = Environment.GetEnvironmentVariable("AZURE_ACCOUNT_KEY");
            var mongoClient = new MongoClient(Environment.GetEnvironmentVariable("MONGO_CONNECTION_STRING"));

            // Get mongo events
            var eventRepository = new EventRepository(mongoClient);
            var events = await eventRepository.GetEvents();

            // Get mongo registrations
            var registrationRepository = new RegistrationRepository(mongoClient);
            var registrations = await registrationRepository.GetRegistrations();

            // Initialize azure repositories
            var storageAccount = new CloudStorageAccount(new Microsoft.WindowsAzure.Storage.Auth.StorageCredentials(accountName, keyValue), true);
            var azureEventsRepository = new Core.Repositories.EventRepository(storageAccount);
            var azureRegistrationsRepository = new Core.Repositories.RegistrationRepository(storageAccount);

            // Migrate events
            foreach (var e in events)
            {
                var existing = await azureEventsRepository.TryGetAsync(e.GetPartitionKey(), e.GetRowKey());
                if (existing == null)
                {
                    await azureEventsRepository.CreateAsync(e);
                }
            }

            // Migrate registrations
            foreach (var r in registrations)
            {
                var existing = await azureRegistrationsRepository.TryGetAsync(r.GetPartitionKey(), r.GetRowKey());
                if (existing == null)
                {
                    await azureRegistrationsRepository.CreateAsync(r);
                }
            }
        }
    }
}