using Presentech.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Presentech.DataAccess.Configurations
{
    public class AdministradorConfiguration : IEntityTypeConfiguration<AdministradorEntity>
    {
        public void Configure(EntityTypeBuilder<AdministradorEntity> builder)
        {
            // =========================
            // TABLA
            // =========================
            builder.ToTable("administradores");

            // =========================
            // CLAVE PRIMARIA
            // =========================
            builder.HasKey(a => a.id_admin)
                   .HasName("PK_ADMINISTRADORES");

            builder.Property(a => a.id_admin)
                   .ValueGeneratedOnAdd();

            // =========================
            // DATOS PERSONALES
            // =========================
            builder.Property(a => a.nombres)
                   .IsRequired()
                   .HasMaxLength(150);

            builder.Property(a => a.apellidos)
                   .IsRequired()
                   .HasMaxLength(150);

            // =========================
            // DATOS DE CONTACTO
            // =========================
            builder.Property(a => a.correo_institucional)
                   .IsRequired()
                   .HasMaxLength(200);

            // =========================
            // AUTENTICACIÓN
            // =========================
            builder.Property(a => a.contrasena_hash)
                   .IsRequired()
                   .HasMaxLength(255);

            // =========================
            // ESTADO / CICLO DE VIDA
            // =========================
            builder.Property(a => a.activo)
                   .IsRequired()
                   .HasDefaultValue(true);

            // =========================
            // AUDITORÍA
            // =========================
            builder.Property(a => a.created_at)
                   .IsRequired()
                   .HasColumnType("timestamp")
                   .HasDefaultValueSql("NOW()");

            // =========================
            // ÍNDICES / UNIQUE
            // =========================
            builder.HasIndex(a => a.correo_institucional)
                   .IsUnique()
                   .HasDatabaseName("UQ_ADMINISTRADORES_CORREO");
        }
    }
}
