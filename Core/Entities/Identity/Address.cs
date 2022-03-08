using System.ComponentModel.DataAnnotations;

namespace Core.Entities.Identity
{
    public class Address
    {
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Street { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string ZipCode { get; set; }


        //Helps Entity Framework make a 1:1 relationship with the AppUser class
        [Required]
        public string AppUserId { get; set; }

        public AppUser AppUser { get; set; }
    }
}