using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Specification;

namespace Core.Specifications
{
    public class ProductWithFiltersForCountSpecifications : BaseSpecification<Product>
    {
        //Get the count of items without any other filters, to use in the "Pagination" class
        public ProductWithFiltersForCountSpecifications(ProductSpecParams productParams)
            : base(x => 
                (string.IsNullOrEmpty(productParams.Search) || x.Name.ToLower().Contains
                (productParams.Search)) && 
                (!productParams.BrandId.HasValue || x.ProductBrandId == productParams.BrandId) && 
                (!productParams.TypeId.HasValue || x.ProductTypeId == productParams.TypeId)  // (or else expression)(!typeId.HasValue or else x.ProductTypeId == typeId) if typeId = true then first expression is false, then the expression after || executes)
            )
        {
        }
    }
}