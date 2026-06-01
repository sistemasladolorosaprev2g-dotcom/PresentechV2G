using Presentech.DataManagement.Interfaces;
using Presentech.DataManagement.Mappers;
using Presentech.DataManagement.Models;

namespace Presentech.DataManagement.Services
{
    public class MateriaDataService : IMateriaDataService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MateriaDataService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<MateriaDataModel>> ObtenerTodasLasMateriasAsync()
        {
            var entities = await _unitOfWork.MateriaRepository.GetMateriasAsync();
            return entities.Select(MateriaDataMapper.MapToModel).ToList();
        }

        public async Task<MateriaDataModel> ObtenerMateriaPorIdAsync(int id)
        {
            var entity = await _unitOfWork.MateriaRepository.GetMateriaByIdAsync(id);
            if (entity == null)
            {
                throw new KeyNotFoundException($"Materia con ID {id} no encontrada.");
            }
            return MateriaDataMapper.MapToModel(entity);
        }

        public async Task<MateriaDataModel> CrearMateriaAsync(MateriaDataModel model)
        {
            var existing = await _unitOfWork.MateriaRepository.GetMateriaByNombreAsync(model.Nombre);
            if (existing != null)
            {
                throw new InvalidOperationException($"La materia '{model.Nombre}' ya existe.");
            }

            var entity = MateriaDataMapper.MapToEntity(model);
            entity.CreatedAt = DateTime.UtcNow;
            
            var result = await _unitOfWork.MateriaRepository.AddMateriaAsync(entity);
            return MateriaDataMapper.MapToModel(result);
        }

        public async Task<MateriaDataModel> ActualizarMateriaAsync(int id, MateriaDataModel model)
        {
            var entity = await _unitOfWork.MateriaRepository.GetMateriaByIdAsync(id);
            if (entity == null)
            {
                throw new KeyNotFoundException($"Materia con ID {id} no encontrada.");
            }

            var existingName = await _unitOfWork.MateriaRepository.GetMateriaByNombreAsync(model.Nombre);
            if (existingName != null && existingName.IdMateria != id)
            {
                throw new InvalidOperationException($"Ya existe otra materia con el nombre '{model.Nombre}'.");
            }

            entity.Nombre = model.Nombre;
            entity.Descripcion = model.Descripcion;
            entity.Activo = model.Activo;

            var result = await _unitOfWork.MateriaRepository.UpdateMateriaAsync(entity);
            return MateriaDataMapper.MapToModel(result);
        }

        public async Task<bool> EliminarMateriaAsync(int id)
        {
            var entity = await _unitOfWork.MateriaRepository.GetMateriaByIdAsync(id);
            if (entity == null)
            {
                return false;
            }

            // Soft delete
            entity.Activo = false;
            await _unitOfWork.MateriaRepository.UpdateMateriaAsync(entity);
            return true;
        }
    }
}
