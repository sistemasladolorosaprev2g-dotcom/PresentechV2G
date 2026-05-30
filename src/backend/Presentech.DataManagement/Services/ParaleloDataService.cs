using Presentech.DataManagement.Interfaces;
using Presentech.DataManagement.Mappers;
using Presentech.DataManagement.Models;
using Presentech.DataAccess.Entities;

namespace Presentech.DataManagement.Services
{
    public class ParaleloDataService : IParaleloDataService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ParaleloDataService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // =========================
        // CONSULTAS
        // =========================
        public async Task<ParaleloDataModel?> ObtenerPorIdAsync(int id_paralelo, CancellationToken cancellationToken = default)
        {
            var entity = await _unitOfWork.ParaleloRepository.ObtenerPorIdAsync(id_paralelo, cancellationToken);
            return entity is null ? null : ParaleloDataMapper.ToDataModel(entity);
        }

        public async Task<IReadOnlyList<ParaleloDataModel>> ObtenerTodosActivosAsync(CancellationToken cancellationToken = default)
        {
            var entities = await _unitOfWork.ParaleloRepository.ObtenerTodosActivosAsync(cancellationToken);
            return entities.Select(ParaleloDataMapper.ToDataModel).ToList();
        }

        // =========================
        // COMANDOS (ADMIN)
        // =========================
        public async Task<ParaleloDataModel> CrearAsync(ParaleloDataModel model, CancellationToken cancellationToken = default)
        {
            var entity = new ParaleloEntity
            {
                nombre           = model.nombre,
                descripcion      = model.descripcion,
                capacidad_maxima = model.capacidad_maxima,
                activo           = true,
                created_at       = DateTime.UtcNow,
            };

            await _unitOfWork.ParaleloRepository.AgregarAsync(entity, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return ParaleloDataMapper.ToDataModel(entity);
        }

        public async Task<ParaleloDataModel> ActualizarAsync(ParaleloDataModel model, CancellationToken cancellationToken = default)
        {
            var entity = await _unitOfWork.ParaleloRepository.ObtenerPorIdAsync(model.id_paralelo, cancellationToken)
                ?? throw new KeyNotFoundException($"Paralelo {model.id_paralelo} no encontrado.");

            var updEntity = new ParaleloEntity
            {
                id_paralelo      = model.id_paralelo,
                nombre           = model.nombre,
                descripcion      = model.descripcion,
                capacidad_maxima = model.capacidad_maxima,
                activo           = true,
                created_at       = entity.created_at,
            };

            _unitOfWork.ParaleloRepository.Actualizar(updEntity);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return ParaleloDataMapper.ToDataModel(updEntity);
        }

        public async Task EliminarAsync(int id_paralelo, CancellationToken cancellationToken = default)
        {
            var entity = await _unitOfWork.ParaleloRepository.ObtenerPorIdAsync(id_paralelo, cancellationToken)
                ?? throw new KeyNotFoundException($"Paralelo {id_paralelo} no encontrado.");

            var entitySoftDelete = new ParaleloEntity
            {
                id_paralelo      = entity.id_paralelo,
                nombre           = entity.nombre,
                descripcion      = entity.descripcion,
                capacidad_maxima = entity.capacidad_maxima,
                activo           = true,
                created_at       = entity.created_at,
            };

            _unitOfWork.ParaleloRepository.Eliminar(entitySoftDelete);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}
