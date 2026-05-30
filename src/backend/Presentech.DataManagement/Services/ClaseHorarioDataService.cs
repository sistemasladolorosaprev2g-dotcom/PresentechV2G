using Presentech.DataManagement.Interfaces;
using Presentech.DataManagement.Mappers;
using Presentech.DataManagement.Models;
using Presentech.DataAccess.Entities;

namespace Presentech.DataManagement.Services
{
    public class ClaseHorarioDataService : IClaseHorarioDataService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ClaseHorarioDataService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // =========================
        // CONSULTAS
        // =========================
        public async Task<ClaseHorarioDataModel?> ObtenerPorIdAsync(int id_horario, CancellationToken cancellationToken = default)
        {
            var entity = await _unitOfWork.ClaseHorarioRepository.ObtenerPorIdAsync(id_horario, cancellationToken);
            return entity is null ? null : ClaseDataMapper.ToHorarioDataModel(entity);
        }

        // =========================
        // COMANDOS (ADMIN)
        // =========================
        public async Task<ClaseHorarioDataModel> AgregarAsync(ClaseHorarioDataModel model, CancellationToken cancellationToken = default)
        {
            var entity = new ClaseHorarioEntity
            {
                id_clase    = model.id_clase,
                id_dia      = model.id_dia,
                hora_inicio = model.hora_inicio,
                hora_fin    = model.hora_fin,
            };

            await _unitOfWork.ClaseHorarioRepository.AgregarAsync(entity, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var created = await _unitOfWork.ClaseHorarioRepository.ObtenerPorIdAsync(entity.id_horario, cancellationToken);
            return ClaseDataMapper.ToHorarioDataModel(created!);
        }

        public async Task EliminarAsync(int id_horario, CancellationToken cancellationToken = default)
        {
            var entity = await _unitOfWork.ClaseHorarioRepository.ObtenerPorIdAsync(id_horario, cancellationToken)
                ?? throw new KeyNotFoundException($"Horario {id_horario} no encontrado.");

            _unitOfWork.ClaseHorarioRepository.Eliminar(entity);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}
