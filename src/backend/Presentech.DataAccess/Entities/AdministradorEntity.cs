namespace Presentech.DataAccess.Entities
{
    public class AdministradorEntity
    {
        // =========================
        // CLAVE PRIMARIA
        // =========================
        public int id_admin { get; set; }

        // =========================
        // DATOS PERSONALES
        // =========================
        public string nombres { get; set; } = null!;
        public string apellidos { get; set; } = null!;

        // =========================
        // DATOS DE CONTACTO
        // =========================
        public string correo_institucional { get; set; } = null!;

        // =========================
        // AUTENTICACIÓN
        // =========================
        public string contrasena_hash { get; set; } = null!;

        // =========================
        // ESTADO / CICLO DE VIDA
        // =========================
        public bool activo { get; set; }
        public DateTime created_at { get; set; }
    }
}
