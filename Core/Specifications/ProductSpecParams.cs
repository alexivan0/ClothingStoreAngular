using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class ProductSpecParams
    {
        private const int MaxPageSize = 50;

        public int PageIndex {get; set;} = 1; // Returns the 1st page by default

        private int _pageSize = 6;

        // Specific options for the get / set methods
        public int PageSize 
        {
            get => _pageSize;

            // If the value > MaxPageSize then return MaxPageSize, else return value
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value; 
        }

        public int? BrandId { get; set; } // ? = optional
        public int? TypeId { get; set; } // ? = optional
        public string Sort { get; set; }

        private string _search;

        public string Search
        {
            get => _search;
            set => _search = value.ToLower();
        }
    }
}