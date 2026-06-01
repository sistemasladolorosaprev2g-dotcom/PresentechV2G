using Presentech.DataManagement.Interfaces;
using Presentech.DataManagement.Mappers;
using Presentech.DataManagement.Models;
using Presentech.DataAccess.Entities;

namespace Presentech.DataManagement.Services
{
    public class ClaseDataService : IClaseDataService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ClaseDataService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // =========================
        // CONSULTAS
        // =========================
        public async Task<IReadOnlyList<ClaseDataModel>> ObtenerTodasAsync(CancellationToken cancellationToken = default)
        {
            var entities = await _unitOfWork.ClaseRepository.ObtenerTodasAsync(cancellationToken);
            return entities.Select(ClaseDataMapper.ToDataModel).ToList();
        }

        public async Task<IReadOnlyList<ClaseDataModel>> ObtenerPorProfesorAsync(int id_profesor, CancellationToken cancellationToken = default)
        {
            var entities = await _unitOfWork.ClaseRepository.ObtenerPorProfesorAsync(id_profesor, cancellationToken);
            return entities.Select(ClaseDataMapper.ToDataModel).ToList();
        }

        public async Task<ClaseDataModel?> ObtenerPorIdAsync(int id_clase, CancellationToken cancellationToken = default)
        {
            var entity = await _unitOfWork.ClaseRepository.ObtenerPorIdAsync(id_clase, cancellationToken);
            return entity is null ? null : ClaseDataMapper.ToDataModel(entity);
        }

        public async Task<ClaseDataModel?> ObtenerConHorarioAsync(int id_clase, CancellationToken cancellationToken = default)
        {
            var entity = await _unitOfWork.ClaseRepository.ObtenerConHorarioAsync(id_clase, cancellationToken);
            return entity is null ? null : ClaseDataMapper.ToDataModel(entity);
        }

        // =========================
        // COMANDOS (ADMIN)
        // =========================
        public async Task<ClaseDataModel> CrearAsync(ClaseDataModel model, CancellationToken cancellationToken = default)
        {
            var entity = new ClaseEntity
            {
                id_profesor   = model.id_profesor,
                id_paralelo   = model.id_paralelo,
                id_materia    = model.id_materia,
                observaciones = model.observaciones,
                activo        = true,
                created_at    = DateTime.UtcNow,
            };

            await _unitOfWork.ClaseRepository.AgregarAsync(entity, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Recargar con relaciones para el response
            var created = await _unitOfWork.ClaseRepository.ObtenerConHorarioAsync(entity.id_clase, cancellationToken);
            return ClaseDataMapper.ToDataModel(created!);
        }

        public async Task<ClaseDataModel> ActualizarAsync(ClaseDataModel model, CancellationToken cancellationToken = default)
        {
            var entity = await _unitOfWork.ClaseRepository.ObtenerPorIdAsync(model.id_clase, cancellationToken)
                ?? throw new KeyNotFoundException($"Clase {model.id_clase} no encontrada.");

            // Necesitamos la entidad con tracking para actualizar
            var entityTracked = await _unitOfWork.ClaseRepository.ObtenerConHorarioAsync(model.id_clase, cancellationToken)
                ?? throw new KeyNotFoundException($"Clase {model.id_clase} no encontrada.");

            var updEntity = new ClaseEntity
            {
                id_clase      = model.id_clase,
                id_profesor   = model.id_profesor,
                id_paralelo   = model.id_paralelo,
                id_materia    = model.id_materia,
                observaciones = model.observaciones,
                activo        = true,
                created_at    = entity.created_at,
            };

            _unitOfWork.ClaseRepository.Actualizar(updEntity);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return model;
        }

        public async Task EliminarAsync(int id_clase, CancellationToken cancellationToken = default)
        {
            var entity = await _unitOfWork.ClaseRepository.ObtenerPorIdAsync(id_clase, cancellationToken)
                ?? throw new KeyNotFoundException($"Clase {id_clase} no encontrada.");

            // Necesitamos una entidad con tracking para el soft delete
            var entitySoftDelete = new ClaseEntity
            {
                id_clase    = entity.id_clase,
                id_profesor = entity.id_profesor,
                id_paralelo = entity.id_paralelo,
                id_materia  = entity.id_materia,
                activo      = true,
                created_at  = entity.created_at,
            };

            _unitOfWork.ClaseRepository.Eliminar(entitySoftDelete);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}
