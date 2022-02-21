using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
        //context = all the models(classes)(EX: Products, ProductBrands, ProductTypes) that EF uses as DB tables
        //loggerFactory = stores the errors that might appear while executing the method below
        public static async Task SeedAsync(StoreContext context, ILoggerFactory loggerFactory)
        {
            try
            {
                if (!context.ProductBrands.Any())
                {
                    // reads the data from a json file
                    var brandsData = File.ReadAllText("../Infrastructure/Data/SeedData/brands.json");

                    //converts it into a list of objects
                    var brands = JsonSerializer.Deserialize<List<ProductBrand>>(brandsData);

                    // for each object in the list
                    foreach (var item in brands)
                    {
                        //adds the object to the ProductBrands model(table) in the database
                        context.ProductBrands.Add(item);
                    }
                    
                    //calls EF to save the changes to the DB
                    await context.SaveChangesAsync();
                }

                if (!context.ProductTypes.Any())
                {
                    var typesData = File.ReadAllText("../Infrastructure/Data/SeedData/types.json");

                    var types = JsonSerializer.Deserialize<List<ProductType>>(typesData);

                    foreach (var item in types)
                    {
                        context.ProductTypes.Add(item);
                    }

                    await context.SaveChangesAsync();
                }

                if (!context.Products.Any())
                {
                    var productsData = File.ReadAllText("../Infrastructure/Data/SeedData/products.json");

                    var products = JsonSerializer.Deserialize<List<Product>>(productsData);

                    foreach (var item in products)
                    {
                        context.Products.Add(item);
                    }

                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<StoreContextSeed>(); //store the error
                logger.LogError(ex.Message); // display the error in the console
            }
        }
    }
}