using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities.OrderAggregate
{
    // Deriving from BaseEntity in order to have an id and have it's own table in the database
    public class OrderItem : BaseEntity
    {
        //This is needed for EF to work
        public OrderItem()
        {
        }

        //This is needed in order to populate the values when we create an OrderItem
        public OrderItem(ProductItemOrdered itemOrdered, decimal price, int quantity)
        {
            ItemOrdered = itemOrdered;
            Price = price;
            Quantity = quantity;
        }

        public ProductItemOrdered ItemOrdered { get; set; }

            public decimal Price { get; set; }

            public int Quantity { get; set; }
    }
}