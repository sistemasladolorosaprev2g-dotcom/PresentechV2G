using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Presentech.DataAccess.Entities;

namespace Presentech.DataAccess.Configurations
{
    public class MateriaConfiguration : IEntityTypeConfiguration<MateriaEntity>
    {
        public void Configure(EntityTypeBuilder<MateriaEntity> builder)
        {
            builder.ToTable("materias");

            builder.HasKey(m => m.IdMateria);

            builder.Property(m => m.IdMateria)
                .HasColumnName("id_materia")
                .UseIdentityColumn();

            builder.Property(m => m.Nombre)
                .HasColumnName("nombre")
                .IsRequired()
                .HasMaxLength(100);

            builder.HasIndex(m => m.Nombre)
                .IsUnique();

            builder.Property(m => m.Descripcion)
                .HasColumnName("descripcion");

            builder.Property(m => m.Activo)
                .HasColumnName("activo")
                .HasDefaultValue(true);

            builder.Property(m => m.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        }
    }
}
