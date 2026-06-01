using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Presentech.DataAccess.Entities
{
    [Table("materias")]
    public class MateriaEntity
    {
        [Key]
        [Column("id_materia")]
        public int IdMateria { get; set; }

        [Required]
        [Column("nombre")]
        [MaxLength(100)]
        public string Nombre { get; set; }

        [Column("descripcion")]
        public string? Descripcion { get; set; }

        [Column("activo")]
        public bool Activo { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
