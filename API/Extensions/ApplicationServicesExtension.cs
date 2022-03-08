using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Errors;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Extensions
{
    public static class ApplicationServicesExtension
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<ITokenService, TokenService>();
            // add the product repository to the services
            services.AddScoped<IProductRepository, ProductRepository>();
            // add the basket repository to the services
            services.AddScoped<IBasketRepository, BasketRepository>();
            // add the generic repository to the services
            services.AddScoped(typeof(IGenericRepository<>), (typeof(GenericRepository<>))); 

            // configure how the api behaves
            services.Configure<ApiBehaviorOptions>(options =>
           {
               //if the api request sends an error
               options.InvalidModelStateResponseFactory = actionContext =>
               {
                   // selects only the error message from the request returned and store it as an array of errors in the "errors" variable
                   var errors = actionContext.ModelState   
                       .Where(e => e.Value.Errors.Count > 0)
                       .SelectMany(x => x.Value.Errors)
                       .Select(x => x.ErrorMessage).ToArray();

                   var errorResponse = new ApiValidationErrorResponse // stores the custom error in the "errorResponse" variable
                   {
                       Errors = errors // stores the previously selected error messages from the request? and store it in the "Errors" variable
                   };

                   return new BadRequestObjectResult(errorResponse); // returns the custom error message to the client

               };
           });

           // returns the default services with the added functionalities(repositories) and changed funcitonalities(the returned invalid respnse?)
           return services;
        }
    }
}