using Presentech.DataManagement.Models;

namespace Presentech.DataManagement.Interfaces
{
    public interface IClaseHorarioDataService
    {
        // =========================
        // CONSULTAS
        // =========================
        Task<ClaseHorarioDataModel?> ObtenerPorIdAsync(int id_horario, CancellationToken cancellationToken = default);

        // =========================
        // COMANDOS (ADMIN)
        // =========================
        Task<ClaseHorarioDataModel> AgregarAsync(ClaseHorarioDataModel model, CancellationToken cancellationToken = default);
        Task EliminarAsync(int id_horario, CancellationToken cancellationToken = default);
    }
}
