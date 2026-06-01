using Presentech.DataAccess.Entities;

namespace Presentech.DataAccess.Repositories.Interfaces
{
    public interface IMateriaRepository
    {
        Task<IEnumerable<MateriaEntity>> GetMateriasAsync();
        Task<MateriaEntity?> GetMateriaByIdAsync(int id);
        Task<MateriaEntity?> GetMateriaByNombreAsync(string nombre);
        Task<MateriaEntity> AddMateriaAsync(MateriaEntity materia);
        Task<MateriaEntity> UpdateMateriaAsync(MateriaEntity materia);
    }
}
