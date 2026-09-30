using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiVehiculos.Data;
using ApiVehiculos.Models;

namespace ApiVehiculos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CargaVehiculoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CargaVehiculoController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/CargaVehiculo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehiculos>>> GetVehiculos()
        {
            return await _context.Vehiculos.ToListAsync();
        }

        // GET: api/CargaVehiculo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Vehiculos>> GetVehiculos(int id)
        {
            var vehiculos = await _context.Vehiculos.FindAsync(id);

            if (vehiculos == null)
            {
                return NotFound();
            }

            return vehiculos;
        }

        // PUT: api/CargaVehiculo/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVehiculos(int id, Vehiculos vehiculos)
        {
            if (id != vehiculos.VehiculoId)
            {
                return BadRequest();
            }

            _context.Entry(vehiculos).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VehiculosExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/CargaVehiculo
        [HttpPost]
        public async Task<ActionResult<Vehiculos>> PostVehiculos(Vehiculos vehiculos)
        {
            _context.Vehiculos.Add(vehiculos);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                "GetVehiculos",
                new { id = vehiculos.VehiculoId },
                vehiculos
            );
        }

        // DELETE: api/CargaVehiculo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehiculo(int id)
        {
            var vehiculo = await _context.Vehiculos.FindAsync(id);

            if (vehiculo == null)
            {
                return NotFound("El vehículo no existe.");
            }

            if (vehiculo.Disponible == true)
            {
                return BadRequest(
                    "No se puede eliminar un vehículo que está disponible."
                );
            }

            _context.Vehiculos.Remove(vehiculo);

            await _context.SaveChangesAsync();

            return Ok("Vehículo eliminado correctamente.");
        }

        // Verifica si existe el vehículo
        private bool VehiculosExists(int id)
        {
            return _context.Vehiculos.Any(e => e.VehiculoId == id);
        }
    }
}