using Presentech.DataManagement.Models;

namespace Presentech.DataManagement.Interfaces
{
    public interface IAdministradorDataService
    {
        // =========================
        // CONSULTAS
        // =========================
        Task<AdministradorDataModel?> ObtenerPorIdAsync(int id_admin, CancellationToken cancellationToken = default);
        Task<AdministradorDataModel?> ObtenerPorCorreoAsync(string correo_institucional, CancellationToken cancellationToken = default);

        // =========================
        // COMANDOS
        // =========================
        Task<AdministradorDataModel> AgregarAsync(AdministradorDataModel dataModel, CancellationToken cancellationToken = default);
    }
}
