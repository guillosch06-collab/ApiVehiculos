using Microsoft.EntityFrameworkCore;
using ApiVehiculos.Models;

namespace ApiVehiculos.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Vehiculos> Vehiculos { get; set; }
}