using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public interface ISpecification<T>
    {

        //Interfaces that need to be implemented inside "BaseSpecification class"
        
        Expression<Func<T, bool>> Criteria {get; } // the Criteria that's evaluated(inside "Data/SpecificationEvaluator") to get the products

        List<Expression<Func<T, object>>> Includes {get; } //add extra conditions to the LINQ expression(Criteria)

        Expression<Func<T, object>> OrderBy {get; } // order by something

        Expression<Func<T, object>> OrderByDescending {get; } // order by something, reversed

        int Take {get;} // take a number of products

        int Skip {get;} // skip a number of products
        
        bool ISpagingEnabled {get;} // enable the options above or not
    }
}