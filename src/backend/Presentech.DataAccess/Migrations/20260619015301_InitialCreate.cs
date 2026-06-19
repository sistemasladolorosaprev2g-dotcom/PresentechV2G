using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Presentech.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "administradores",
                columns: table => new
                {
                    id_admin = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombres = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    apellidos = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    correo_institucional = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    contrasena_hash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    activo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ADMINISTRADORES", x => x.id_admin);
                });

            migrationBuilder.CreateTable(
                name: "dias_semana",
                columns: table => new
                {
                    id_dia = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    orden = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DIAS_SEMANA", x => x.id_dia);
                });

            migrationBuilder.CreateTable(
                name: "estudiantes",
                columns: table => new
                {
                    id_estudiante = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombres = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    apellidos = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    activo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ESTUDIANTES", x => x.id_estudiante);
                });

            migrationBuilder.CreateTable(
                name: "materias",
                columns: table => new
                {
                    id_materia = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    descripcion = table.Column<string>(type: "text", nullable: true),
                    activo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_materias", x => x.id_materia);
                });

            migrationBuilder.CreateTable(
                name: "paralelos",
                columns: table => new
                {
                    id_paralelo = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    descripcion = table.Column<string>(type: "text", nullable: true),
                    capacidad_maxima = table.Column<int>(type: "integer", nullable: false),
                    activo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PARALELOS", x => x.id_paralelo);
                });

            migrationBuilder.CreateTable(
                name: "profesores",
                columns: table => new
                {
                    id_profesor = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombres = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    apellidos = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    correo_institucional = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    telefono = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    especialidad = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    contrasena_hash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    activo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PROFESORES", x => x.id_profesor);
                });

            migrationBuilder.CreateTable(
                name: "paralelo_estudiantes",
                columns: table => new
                {
                    id_paralelo_estudiante = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_paralelo = table.Column<int>(type: "integer", nullable: false),
                    id_estudiante = table.Column<int>(type: "integer", nullable: false),
                    activo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PARALELO_ESTUDIANTES", x => x.id_paralelo_estudiante);
                    table.ForeignKey(
                        name: "FK_PE_ESTUDIANTE",
                        column: x => x.id_estudiante,
                        principalTable: "estudiantes",
                        principalColumn: "id_estudiante",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PE_PARALELO",
                        column: x => x.id_paralelo,
                        principalTable: "paralelos",
                        principalColumn: "id_paralelo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "clases",
                columns: table => new
                {
                    id_clase = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_profesor = table.Column<int>(type: "integer", nullable: false),
                    id_paralelo = table.Column<int>(type: "integer", nullable: false),
                    id_materia = table.Column<int>(type: "integer", nullable: false),
                    observaciones = table.Column<string>(type: "text", nullable: true),
                    activo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CLASES", x => x.id_clase);
                    table.ForeignKey(
                        name: "FK_CLASES_PARALELO",
                        column: x => x.id_paralelo,
                        principalTable: "paralelos",
                        principalColumn: "id_paralelo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CLASES_PROFESOR",
                        column: x => x.id_profesor,
                        principalTable: "profesores",
                        principalColumn: "id_profesor",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_clases_materias",
                        column: x => x.id_materia,
                        principalTable: "materias",
                        principalColumn: "id_materia",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "opiniones_recomendaciones",
                columns: table => new
                {
                    id_opinion = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_profesor = table.Column<int>(type: "integer", nullable: false),
                    utilizaria_siguiente_anio = table.Column<bool>(type: "boolean", nullable: false),
                    calificacion_usabilidad = table.Column<int>(type: "integer", nullable: false),
                    aspecto_mas_util = table.Column<string>(type: "text", nullable: false),
                    aspectos_por_mejorar = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OPINIONES_RECOMENDACIONES", x => x.id_opinion);
                    table.CheckConstraint("CHK_OPINIONES_CALIFICACION_USABILIDAD", "calificacion_usabilidad BETWEEN 1 AND 5");
                    table.ForeignKey(
                        name: "FK_OPINIONES_PROFESOR",
                        column: x => x.id_profesor,
                        principalTable: "profesores",
                        principalColumn: "id_profesor",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "clases_horario",
                columns: table => new
                {
                    id_horario = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_clase = table.Column<int>(type: "integer", nullable: false),
                    id_dia = table.Column<int>(type: "integer", nullable: false),
                    hora_inicio = table.Column<TimeOnly>(type: "time", nullable: false),
                    hora_fin = table.Column<TimeOnly>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CLASES_HORARIO", x => x.id_horario);
                    table.CheckConstraint("CHK_HORARIO_HORAS", "hora_fin > hora_inicio");
                    table.ForeignKey(
                        name: "FK_HORARIO_CLASE",
                        column: x => x.id_clase,
                        principalTable: "clases",
                        principalColumn: "id_clase",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HORARIO_DIA",
                        column: x => x.id_dia,
                        principalTable: "dias_semana",
                        principalColumn: "id_dia",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "registros_asistencia",
                columns: table => new
                {
                    id_registro = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_horario = table.Column<int>(type: "integer", nullable: false),
                    fecha = table.Column<DateOnly>(type: "date", nullable: false),
                    total_presentes = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    total_ausentes = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    observaciones_sesion = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_REGISTROS_ASISTENCIA", x => x.id_registro);
                    table.ForeignKey(
                        name: "FK_REGISTRO_HORARIO",
                        column: x => x.id_horario,
                        principalTable: "clases_horario",
                        principalColumn: "id_horario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "asistencias",
                columns: table => new
                {
                    id_asistencia = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_registro = table.Column<int>(type: "integer", nullable: false),
                    id_estudiante = table.Column<int>(type: "integer", nullable: false),
                    asistio = table.Column<bool>(type: "boolean", nullable: false),
                    atrasado = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    justificativo = table.Column<string>(type: "text", nullable: true),
                    observaciones = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ASISTENCIAS", x => x.id_asistencia);
                    table.ForeignKey(
                        name: "FK_ASISTENCIA_ESTUDIANTE",
                        column: x => x.id_estudiante,
                        principalTable: "estudiantes",
                        principalColumn: "id_estudiante",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ASISTENCIA_REGISTRO",
                        column: x => x.id_registro,
                        principalTable: "registros_asistencia",
                        principalColumn: "id_registro",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "UQ_ADMINISTRADORES_CORREO",
                table: "administradores",
                column: "correo_institucional",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IDX_ASISTENCIAS_REGISTRO",
                table: "asistencias",
                column: "id_registro");

            migrationBuilder.CreateIndex(
                name: "IX_asistencias_id_estudiante",
                table: "asistencias",
                column: "id_estudiante");

            migrationBuilder.CreateIndex(
                name: "IDX_CLASES_PARALELO",
                table: "clases",
                column: "id_paralelo");

            migrationBuilder.CreateIndex(
                name: "IDX_CLASES_PROFESOR",
                table: "clases",
                column: "id_profesor");

            migrationBuilder.CreateIndex(
                name: "IX_clases_id_materia",
                table: "clases",
                column: "id_materia");

            migrationBuilder.CreateIndex(
                name: "IDX_CLASES_HORARIO_CLASE",
                table: "clases_horario",
                column: "id_clase");

            migrationBuilder.CreateIndex(
                name: "IX_clases_horario_id_dia",
                table: "clases_horario",
                column: "id_dia");

            migrationBuilder.CreateIndex(
                name: "UQ_DIAS_SEMANA_ORDEN",
                table: "dias_semana",
                column: "orden",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_materias_nombre",
                table: "materias",
                column: "nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IDX_OPINIONES_PROFESOR",
                table: "opiniones_recomendaciones",
                column: "id_profesor");

            migrationBuilder.CreateIndex(
                name: "IX_paralelo_estudiantes_id_estudiante",
                table: "paralelo_estudiantes",
                column: "id_estudiante");

            migrationBuilder.CreateIndex(
                name: "UQ_PE_PARALELO_ESTUDIANTE",
                table: "paralelo_estudiantes",
                columns: new[] { "id_paralelo", "id_estudiante" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_PROFESORES_CORREO",
                table: "profesores",
                column: "correo_institucional",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_REGISTRO_HORARIO_FECHA",
                table: "registros_asistencia",
                columns: new[] { "id_horario", "fecha" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "administradores");

            migrationBuilder.DropTable(
                name: "asistencias");

            migrationBuilder.DropTable(
                name: "opiniones_recomendaciones");

            migrationBuilder.DropTable(
                name: "paralelo_estudiantes");

            migrationBuilder.DropTable(
                name: "registros_asistencia");

            migrationBuilder.DropTable(
                name: "estudiantes");

            migrationBuilder.DropTable(
                name: "clases_horario");

            migrationBuilder.DropTable(
                name: "clases");

            migrationBuilder.DropTable(
                name: "dias_semana");

            migrationBuilder.DropTable(
                name: "paralelos");

            migrationBuilder.DropTable(
                name: "profesores");

            migrationBuilder.DropTable(
                name: "materias");
        }
    }
}
