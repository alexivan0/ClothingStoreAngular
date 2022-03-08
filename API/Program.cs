using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            // Creates the environment required to run the aplication(DI, Logging, Configuration, IhostedService implementations)
            var host = CreateHostBuilder(args).Build(); 
            // creates a scope
            using (var scope = host.Services.CreateScope()) 
            {
                // creates services within the scope
                var services = scope.ServiceProvider; 
                // creates a loggerfactory from the services within the scope
                var loggerFactory = services.GetRequiredService<ILoggerFactory>(); 
                try
                {
                    // takes the store context and stores it in "context"
                    var context = services.GetRequiredService<StoreContext>();
                    // migrates the database when the task is ready(only applies migration if EF is not up to date with the database)
                    await context.Database.MigrateAsync(); 
                    // seeds the database from the json file, brings a new instance of "loggerFatory" to the method, so the function can store an possible errors while executing.
                    await StoreContextSeed.SeedAsync(context, loggerFactory); 

                    var userManager = services.GetRequiredService<UserManager<AppUser>>();
                    var identityContext = services.GetRequiredService<AppIdentityDbContext>();
                    await identityContext.Database.MigrateAsync();
                    await AppIdentityDbContextSeed.SeedUsersAsync(userManager);
                }
                catch (Exception ex)
                {
                    // creates a new instance of logggerFactory, which stores the error that occured while executing the try-catch method. Stores the value inside "logger"
                    var logger = loggerFactory.CreateLogger<Program>(); 
                    // display the error in the console
                    logger.LogError(ex, "An error occured during migration");
                }
            }

            // Runs the application
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();   // Uses the Startup class for the host configuration
                });
    }
}
