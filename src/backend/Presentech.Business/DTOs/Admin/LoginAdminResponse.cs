namespace Presentech.Business.DTOs.Admin
{
    public class LoginAdminResponse
    {
        public string token { get; set; } = string.Empty;
        public int id_admin { get; set; }
        public string nombres { get; set; } = string.Empty;
        public string apellidos { get; set; } = string.Empty;
        public string correo_institucional { get; set; } = string.Empty;
        public string rol { get; set; } = "admin";
    }
}
