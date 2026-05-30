namespace Presentech.Business.DTOs.Admin
{
    public record RegisterAdminRequest(
        string nombres,
        string apellidos,
        string correo_institucional,
        string contrasena
    );

    public record RegisterAdminResponse(
        int id_admin,
        string nombres,
        string apellidos,
        string correo_institucional
    );
}
