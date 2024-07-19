using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SignalRProject.Models;

namespace SignalRProject.Data
{
	public class ApplicationDbContext : IdentityDbContext
	{
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
			: base(options)
		{
		}
		public DbSet<Order> Orders { get; set; }
		public DbSet<ChatRoom> ChatRoom { get; set; } = default!;
	}
}
