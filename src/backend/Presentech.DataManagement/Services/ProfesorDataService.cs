using Presentech.DataManagement.Interfaces;
using Presentech.DataManagement.Mappers;
using Presentech.DataManagement.Models;
using Presentech.DataAccess.Entities;

namespace Presentech.DataManagement.Services
{
    public class ProfesorDataService : IProfesorDataService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProfesorDataService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // =========================
        // CONSULTAS
        // =========================
        public async Task<IReadOnlyList<ProfesorDataModel>> ObtenerTodosAsync(CancellationToken cancellationToken = default)
        {
            var entities = await _unitOfWork.ProfesorRepository.ObtenerTodosAsync(cancellationToken);
            return entities.Select(ProfesorDataMapper.ToDataModel).ToList();
        }

        public async Task<ProfesorDataModel?> ObtenerPorIdAsync(int id_profesor, CancellationToken cancellationToken = default)
        {
            var entity = await _unitOfWork.ProfesorRepository.ObtenerPorIdAsync(id_profesor, cancellationToken);
            return entity is null ? null : ProfesorDataMapper.ToDataModel(entity);
        }

        public async Task<ProfesorDataModel?> ObtenerPorCorreoAsync(string correo_institucional, CancellationToken cancellationToken = default)
        {
            var entity = await _unitOfWork.ProfesorRepository.ObtenerPorCorreoAsync(correo_institucional, cancellationToken);
            return entity is null ? null : ProfesorDataMapper.ToDataModel(entity);
        }

        // =========================
        // COMANDOS (ADMIN)
        // =========================
        public async Task<ProfesorDataModel> CrearAsync(ProfesorDataModel model, CancellationToken cancellationToken = default)
        {
            var entity = ProfesorDataMapper.ToEntity(model);
            entity.activo     = true;
            entity.created_at = DateTime.UtcNow;

            await _unitOfWork.ProfesorRepository.AgregarAsync(entity, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return ProfesorDataMapper.ToDataModel(entity);
        }

        public async Task<ProfesorDataModel> ActualizarAsync(ProfesorDataModel model, CancellationToken cancellationToken = default)
        {
            var entity = await _unitOfWork.ProfesorRepository.ObtenerParaActualizarAsync(model.id_profesor, cancellationToken)
                ?? throw new KeyNotFoundException($"Profesor {model.id_profesor} no encontrado.");

            entity.nombres              = model.nombres;
            entity.apellidos            = model.apellidos;
            entity.correo_institucional = model.correo_institucional;
            entity.telefono             = model.telefono;
            entity.especialidad         = model.especialidad;

            if (!string.IsNullOrWhiteSpace(model.contrasena_hash))
                entity.contrasena_hash = model.contrasena_hash;

            _unitOfWork.ProfesorRepository.Actualizar(entity);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return ProfesorDataMapper.ToDataModel(entity);
        }

        public async Task EliminarAsync(int id_profesor, CancellationToken cancellationToken = default)
        {
            var entity = await _unitOfWork.ProfesorRepository.ObtenerParaActualizarAsync(id_profesor, cancellationToken)
                ?? throw new KeyNotFoundException($"Profesor {id_profesor} no encontrado.");

            _unitOfWork.ProfesorRepository.Eliminar(entity);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        // =========================
        // VALIDACIONES
        // =========================
        public async Task<bool> ExistePorCorreoAsync(string correo_institucional, CancellationToken cancellationToken = default)
        {
            return await _unitOfWork.ProfesorRepository.ExistePorCorreoAsync(correo_institucional, cancellationToken);
        }
    }
}
