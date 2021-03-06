using Microsoft.EntityFrameworkCore;

namespace contact_app.Models
{
    public class ContactAppContext : DbContext
    {
          public ContactAppContext(DbContextOptions<ContactAppContext> options)
            : base(options)
        {
        }
        public DbSet<Contact> Contact { get; set; }
        public DbSet<Visit> Visit { get; set; }
        public DbSet<EnlaceVisitContact> EnlaceVisitContact { get; set; }
  }
}
