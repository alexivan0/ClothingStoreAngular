using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Entities;
using Core.Specification;

namespace Core.Specifications
{
    public class ProductsWithTypesAndBrandsSpecification : BaseSpecification<Product>
    {
        // sorts the products, optionally by brand and/or type
        public ProductsWithTypesAndBrandsSpecification(ProductSpecParams productParams)
            : base(x => 
                (string.IsNullOrEmpty(productParams.Search) || x.Name.ToLower().Contains
                (productParams.Search)) && // || = or else; implements the search functionality
                (!productParams.BrandId.HasValue || x.ProductBrandId == productParams.BrandId) &&
                (!productParams.TypeId.HasValue || x.ProductTypeId == productParams.TypeId)  // (or else expression)(!typeId.HasValue or else x.ProductTypeId == typeId) if typeId = true then first expression is false, then the expression after || executes)
            )
        {
            AddInclude(x => x.ProductType); // Adds productType extra parameter info to the requested object.  Ex: "productType": "Boots"
            AddInclude(x => x.ProductBrand); //Adds productBrand extra parameter info to the requested object. Ex: "productBrand": "Angular"
            AddOrderBy(x => x.Name);
            ApplyPaging(productParams.PageSize * (productParams.PageIndex -1), productParams.PageSize); // Ex: {{url}}/api/products?pageSize=10&pageIndex=1
            


            if (!string.IsNullOrEmpty(productParams.Sort))
            {
                switch (productParams.Sort)
                {
                    case "priceAsc":
                        AddOrderBy( p => p.Price); // ex: {{url}}/api/products?sort=priceAsc
                        break;
                    case "priceDesc":
                        AddOrderByDescending(p => p.Price); // ex: {{url}}/api/products?sort=priceDesc
                        break;
                    default:
                        AddOrderBy(n => n.Name); // ex: {{url}}/api/products
                        break;
                }
            }
        }

        public ProductsWithTypesAndBrandsSpecification(int id) : base(x => x.Id == id)
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
        }
    }
}