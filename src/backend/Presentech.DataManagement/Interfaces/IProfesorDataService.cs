using Presentech.DataManagement.Models;

namespace Presentech.DataManagement.Interfaces
{
    public interface IProfesorDataService
    {
        // =========================
        // CONSULTAS
        // =========================
        Task<IReadOnlyList<ProfesorDataModel>> ObtenerTodosAsync(CancellationToken cancellationToken = default);
        Task<ProfesorDataModel?> ObtenerPorIdAsync(int id_profesor, CancellationToken cancellationToken = default);
        Task<ProfesorDataModel?> ObtenerPorCorreoAsync(string correo_institucional, CancellationToken cancellationToken = default);

        // =========================
        // COMANDOS (ADMIN)
        // =========================
        Task<ProfesorDataModel> CrearAsync(ProfesorDataModel model, CancellationToken cancellationToken = default);
        Task<ProfesorDataModel> ActualizarAsync(ProfesorDataModel model, CancellationToken cancellationToken = default);
        Task EliminarAsync(int id_profesor, CancellationToken cancellationToken = default);

        // =========================
        // VALIDACIONES
        // =========================
        Task<bool> ExistePorCorreoAsync(string correo_institucional, CancellationToken cancellationToken = default);
    }
}
