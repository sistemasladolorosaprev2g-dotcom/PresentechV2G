using Presentech.DataManagement.Models;

namespace Presentech.DataManagement.Interfaces
{
    public interface IClaseDataService
    {
        // =========================
        // CONSULTAS
        // =========================
        Task<IReadOnlyList<ClaseDataModel>> ObtenerTodasAsync(CancellationToken cancellationToken = default);
        Task<IReadOnlyList<ClaseDataModel>> ObtenerPorProfesorAsync(int id_profesor, CancellationToken cancellationToken = default);
        Task<ClaseDataModel?> ObtenerPorIdAsync(int id_clase, CancellationToken cancellationToken = default);
        Task<ClaseDataModel?> ObtenerConHorarioAsync(int id_clase, CancellationToken cancellationToken = default);

        // =========================
        // COMANDOS (ADMIN)
        // =========================
        Task<ClaseDataModel> CrearAsync(ClaseDataModel model, CancellationToken cancellationToken = default);
        Task<ClaseDataModel> ActualizarAsync(ClaseDataModel model, CancellationToken cancellationToken = default);
        Task EliminarAsync(int id_clase, CancellationToken cancellationToken = default);
    }
}
