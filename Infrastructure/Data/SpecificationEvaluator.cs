using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class SpecificationEvaluator<TEntity> where TEntity : BaseEntity
    {
        //spec = the custom specifications(criteria, includes, orderby etc...)
        public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> inputQuery, ISpecification<TEntity> spec)
        {
            // inputQuery = an IQueryable(List) of entities from the database (Ex: List of Product)(Ex: 17 products from the db)
            var query = inputQuery;

            if (spec.Criteria != null)
            {
                // from the List of entities, select only the product that meets the Criteria(p => p.ProductTypeId == id(Ex: 2))
                // query now becomes an IEnumerable of the desired criteria(Ex: Product where the id is 2])
                query = query.Where(spec.Criteria);
            }

            if (spec.OrderBy != null)
            {
                query = query.OrderBy(spec.OrderBy);
            }

            if (spec.OrderByDescending != null)
            {
                query = query.OrderByDescending(spec.OrderByDescending);
            }

            if (spec.ISpagingEnabled)
            {
                query = query.Skip(spec.Skip).Take(spec.Take);
            }

            query = spec.Includes.Aggregate(query, (current, include) => current.Include(include));

            return query;
        }
    }
}