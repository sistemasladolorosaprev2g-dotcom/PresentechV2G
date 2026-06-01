using Presentech.DataManagement.Models;

namespace Presentech.DataManagement.Interfaces
{
    public interface IMateriaDataService
    {
        Task<IEnumerable<MateriaDataModel>> ObtenerTodasLasMateriasAsync();
        Task<MateriaDataModel> ObtenerMateriaPorIdAsync(int id);
        Task<MateriaDataModel> CrearMateriaAsync(MateriaDataModel model);
        Task<MateriaDataModel> ActualizarMateriaAsync(int id, MateriaDataModel model);
        Task<bool> EliminarMateriaAsync(int id);
    }
}
