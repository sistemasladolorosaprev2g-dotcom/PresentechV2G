using Presentech.DataAccess.Entities;

namespace Presentech.DataAccess.Repositories.Interfaces
{
    public interface IAdministradorRepository
    {
        // =========================
        // CONSULTAS
        // =========================
        Task<AdministradorEntity?> ObtenerPorIdAsync(int id_admin, CancellationToken cancellationToken = default);
        Task<AdministradorEntity?> ObtenerPorCorreoAsync(string correo_institucional, CancellationToken cancellationToken = default);
        
        // =========================
        // COMANDOS
        // =========================
        Task AgregarAsync(AdministradorEntity entidad, CancellationToken cancellationToken = default);
    }
}
