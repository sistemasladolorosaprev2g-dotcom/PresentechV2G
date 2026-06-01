using Presentech.Business.DTOs.Admin;
using Presentech.DataManagement.Models;

namespace Presentech.Business.Mappers
{
    public static class AdminBusinessMapper
    {
        // =========================
        // PROFESOR
        // =========================
        public static ProfesorAdminResponse ToProfesorResponse(ProfesorDataModel model) => new()
        {
            id_profesor          = model.id_profesor,
            nombres              = model.nombres,
            apellidos            = model.apellidos,
            correo_institucional = model.correo_institucional,
            telefono             = model.telefono,
            especialidad         = model.especialidad,
            activo               = model.activo,
        };

        // =========================
        // PARALELO
        // =========================
        public static ParaleloAdminResponse ToParaleloResponse(ParaleloDataModel model) => new()
        {
            id_paralelo      = model.id_paralelo,
            nombre           = model.nombre,
            descripcion      = model.descripcion,
            capacidad_maxima = model.capacidad_maxima,
            activo           = model.activo,
        };

        // =========================
        // CLASE
        // =========================
        public static ClaseAdminResponse ToClaseResponse(ClaseDataModel model, string nombre_profesor) => new()
        {
            id_clase        = model.id_clase,
            id_profesor     = model.id_profesor,
            nombre_profesor = nombre_profesor,
            id_paralelo     = model.id_paralelo,
            nombre_paralelo = model.nombre_paralelo,
            id_materia      = model.id_materia,
            nombre_materia  = model.nombre_materia,
            observaciones   = model.observaciones,
            horarios        = model.horarios.Select(h => new HorarioAdminResponse
            {
                id_horario  = h.id_horario,
                id_dia      = h.id_dia,
                nombre_dia  = h.nombre_dia,
                hora_inicio = h.hora_inicio.ToString(@"HH\:mm"),
                hora_fin    = h.hora_fin.ToString(@"HH\:mm"),
            }).ToList(),
        };

        // =========================
        // MATERIA
        // =========================
        public static MateriaAdminResponse ToMateriaResponse(MateriaDataModel model) => new()
        {
            id_materia  = model.IdMateria,
            nombre      = model.Nombre,
            descripcion = model.Descripcion,
            activo      = model.Activo,
        };
    }
}
