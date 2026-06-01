using Presentech.DataAccess.Entities;
using Presentech.DataManagement.Models;

namespace Presentech.DataManagement.Mappers
{
    public static class MateriaDataMapper
    {
        public static MateriaDataModel MapToModel(MateriaEntity entity)
        {
            if (entity == null) return null!;

            return new MateriaDataModel
            {
                IdMateria = entity.IdMateria,
                Nombre = entity.Nombre,
                Descripcion = entity.Descripcion,
                Activo = entity.Activo
            };
        }

        public static MateriaEntity MapToEntity(MateriaDataModel model)
        {
            if (model == null) return null!;

            return new MateriaEntity
            {
                IdMateria = model.IdMateria,
                Nombre = model.Nombre,
                Descripcion = model.Descripcion,
                Activo = model.Activo
            };
        }
    }
}
