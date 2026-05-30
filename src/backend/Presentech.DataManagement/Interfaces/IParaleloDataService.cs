using Presentech.DataManagement.Models;

namespace Presentech.DataManagement.Interfaces
{
    public interface IParaleloDataService
    {
        // =========================
        // CONSULTAS
        // =========================
        Task<ParaleloDataModel?> ObtenerPorIdAsync(int id_paralelo, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<ParaleloDataModel>> ObtenerTodosActivosAsync(CancellationToken cancellationToken = default);

        // =========================
        // COMANDOS (ADMIN)
        // =========================
        Task<ParaleloDataModel> CrearAsync(ParaleloDataModel model, CancellationToken cancellationToken = default);
        Task<ParaleloDataModel> ActualizarAsync(ParaleloDataModel model, CancellationToken cancellationToken = default);
        Task EliminarAsync(int id_paralelo, CancellationToken cancellationToken = default);
    }
}
