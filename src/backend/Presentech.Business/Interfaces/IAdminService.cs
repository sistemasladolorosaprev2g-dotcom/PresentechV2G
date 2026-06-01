using Presentech.Business.DTOs.Admin;

namespace Presentech.Business.Interfaces
{
    public interface IAdminService
    {
        // =========================
        // AUTH
        // =========================
        Task<LoginAdminResponse> LoginAsync(LoginAdminRequest request, CancellationToken cancellationToken = default);
        Task<RegisterAdminResponse> RegisterAdminAsync(RegisterAdminRequest request, CancellationToken cancellationToken = default);

        // =========================
        // PROFESORES
        // =========================
        Task<IReadOnlyList<ProfesorAdminResponse>> ObtenerProfesoresAsync(CancellationToken cancellationToken = default);
        Task<ProfesorAdminResponse> ObtenerProfesorAsync(int id_profesor, CancellationToken cancellationToken = default);
        Task<ProfesorAdminResponse> CrearProfesorAsync(CrearProfesorRequest request, CancellationToken cancellationToken = default);
        Task<ProfesorAdminResponse> ActualizarProfesorAsync(int id_profesor, ActualizarProfesorRequest request, CancellationToken cancellationToken = default);
        Task EliminarProfesorAsync(int id_profesor, CancellationToken cancellationToken = default);

        // =========================
        // PARALELOS
        // =========================
        Task<IReadOnlyList<ParaleloAdminResponse>> ObtenerParalelosAsync(CancellationToken cancellationToken = default);
        Task<ParaleloAdminResponse> CrearParaleloAsync(CrearParaleloRequest request, CancellationToken cancellationToken = default);
        Task<ParaleloAdminResponse> ActualizarParaleloAsync(int id_paralelo, ActualizarParaleloRequest request, CancellationToken cancellationToken = default);
        Task EliminarParaleloAsync(int id_paralelo, CancellationToken cancellationToken = default);

        // =========================
        // CLASES
        // =========================
        Task<IReadOnlyList<ClaseAdminResponse>> ObtenerClasesAsync(CancellationToken cancellationToken = default);
        Task<ClaseAdminResponse> CrearClaseAsync(CrearClaseRequest request, CancellationToken cancellationToken = default);
        Task<ClaseAdminResponse> ActualizarClaseAsync(int id_clase, ActualizarClaseRequest request, CancellationToken cancellationToken = default);
        Task EliminarClaseAsync(int id_clase, CancellationToken cancellationToken = default);

        // =========================
        // HORARIOS
        // =========================
        Task<HorarioAdminResponse> AgregarHorarioAsync(int id_clase, AgregarHorarioRequest request, CancellationToken cancellationToken = default);
        Task EliminarHorarioAsync(int id_clase, int id_horario, CancellationToken cancellationToken = default);

        // =========================
        // ESTUDIANTES
        // =========================
        Task<IReadOnlyList<EstudianteAdminResponse>> ObtenerEstudiantesAsync(CancellationToken cancellationToken = default);
        Task<EstudianteAdminResponse> CrearEstudianteAsync(CrearEstudianteRequest request, CancellationToken cancellationToken = default);
        Task<EstudianteAdminResponse> AsignarParaleloAsync(int id_estudiante, int id_paralelo, CancellationToken cancellationToken = default);
        Task DesasignarParaleloAsync(int id_estudiante, int id_paralelo, CancellationToken cancellationToken = default);
        Task ImportarEstudiantesExcelAsync(int id_paralelo, Presentech.Business.DTOs.Estudiante.ImportarEstudiantesRequest request, CancellationToken cancellationToken = default);

        // =========================
        // MATERIAS
        // =========================
        Task<IReadOnlyList<MateriaAdminResponse>> ObtenerMateriasAsync(CancellationToken cancellationToken = default);
        Task<MateriaAdminResponse> CrearMateriaAsync(CrearMateriaRequest request, CancellationToken cancellationToken = default);
        Task<MateriaAdminResponse> ActualizarMateriaAsync(int id_materia, ActualizarMateriaRequest request, CancellationToken cancellationToken = default);
        Task EliminarMateriaAsync(int id_materia, CancellationToken cancellationToken = default);
    }
}
