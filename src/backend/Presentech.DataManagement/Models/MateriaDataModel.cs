namespace Presentech.DataManagement.Models
{
    public class MateriaDataModel
    {
        public int IdMateria { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public bool Activo { get; set; }
    }
}
