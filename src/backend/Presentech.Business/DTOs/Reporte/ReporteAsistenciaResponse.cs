namespace Presentech.Business.DTOs.Reporte
{
    public class ReporteAsistenciaResponse
    {
        public int id_clase { get; set; }
        public string curso { get; set; } = string.Empty;
        public string docente { get; set; } = string.Empty;
        public DateOnly fecha_inicio { get; set; }
        public DateOnly fecha_fin { get; set; }
        public List<ReporteEstudianteResponse> estudiantes { get; set; } = new();
        public ReporteResumenResponse resumen { get; set; } = new();
        public List<ReporteAlertaResponse> alertas { get; set; } = new();
    }

    public class ReporteEstudianteResponse
    {
        public int id_estudiante { get; set; }
        public string nombre_estudiante { get; set; } = string.Empty;
        public string curso { get; set; } = string.Empty;
        public int total_asistencias { get; set; }
        public int total_faltas { get; set; }
        public int total_atrasos { get; set; }
        public double porcentaje_asistencia { get; set; }
        public string estado_academico { get; set; } = string.Empty;
    }

    public class ReporteResumenResponse
    {
        public int total_estudiantes { get; set; }
        public double promedio_asistencia { get; set; }
        public int total_faltas { get; set; }
        public int total_atrasos { get; set; }
    }

    public class ReporteAlertaResponse
    {
        public int id_estudiante { get; set; }
        public string nombre_estudiante { get; set; } = string.Empty;
        public string mensaje { get; set; } = string.Empty;
    }
}
