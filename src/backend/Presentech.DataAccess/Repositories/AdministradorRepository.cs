using Presentech.DataAccess.Context;
using Presentech.DataAccess.Entities;
using Presentech.DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Presentech.DataAccess.Repositories
{
    public class AdministradorRepository : IAdministradorRepository
    {
        private readonly PresentechDbContext _context;

        public AdministradorRepository(PresentechDbContext context)
        {
            _context = context;
        }

        // =========================
        // CONSULTAS
        // =========================
        public async Task<AdministradorEntity?> ObtenerPorIdAsync(int id_admin, CancellationToken cancellationToken = default)
        {
            return await _context.Administradores
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.id_admin == id_admin && a.activo, cancellationToken);
        }

        public async Task<AdministradorEntity?> ObtenerPorCorreoAsync(string correo_institucional, CancellationToken cancellationToken = default)
        {
            return await _context.Administradores
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.correo_institucional == correo_institucional && a.activo, cancellationToken);
        }

        // =========================
        // COMANDOS
        // =========================
        public async Task AgregarAsync(AdministradorEntity entidad, CancellationToken cancellationToken = default)
        {
            await _context.Administradores.AddAsync(entidad, cancellationToken);
        }
    }
}
