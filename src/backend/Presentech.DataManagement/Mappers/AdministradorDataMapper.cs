using Presentech.DataAccess.Entities;
using Presentech.DataManagement.Models;

namespace Presentech.DataManagement.Mappers
{
    public static class AdministradorDataMapper
    {
        // =========================
        // ENTITY → DATA MODEL
        // =========================
        public static AdministradorDataModel ToDataModel(AdministradorEntity entity)
        {
            return new AdministradorDataModel
            {
                id_admin             = entity.id_admin,
                nombres              = entity.nombres,
                apellidos            = entity.apellidos,
                correo_institucional = entity.correo_institucional,
                contrasena_hash      = entity.contrasena_hash,
                activo               = entity.activo,
                created_at           = entity.created_at,
            };
        }

        // =========================
        // DATA MODEL → ENTITY
        // =========================
        public static AdministradorEntity ToEntity(AdministradorDataModel model)
        {
            return new AdministradorEntity
            {
                id_admin             = model.id_admin,
                nombres              = model.nombres,
                apellidos            = model.apellidos,
                correo_institucional = model.correo_institucional,
                contrasena_hash      = model.contrasena_hash,
                activo               = model.activo,
            };
        }
    }
}
