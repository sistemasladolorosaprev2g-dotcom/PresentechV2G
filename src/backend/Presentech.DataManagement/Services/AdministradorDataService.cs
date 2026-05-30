using Presentech.DataManagement.Interfaces;
using Presentech.DataManagement.Mappers;
using Presentech.DataManagement.Models;

namespace Presentech.DataManagement.Services
{
    public class AdministradorDataService : IAdministradorDataService
    {
        private readonly IUnitOfWork _unitOfWork;

        public AdministradorDataService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // =========================
        // CONSULTAS
        // =========================
        public async Task<AdministradorDataModel?> ObtenerPorIdAsync(int id_admin, CancellationToken cancellationToken = default)
        {
            var entity = await _unitOfWork.AdministradorRepository.ObtenerPorIdAsync(id_admin, cancellationToken);
            return entity is null ? null : AdministradorDataMapper.ToDataModel(entity);
        }

        public async Task<AdministradorDataModel?> ObtenerPorCorreoAsync(string correo_institucional, CancellationToken cancellationToken = default)
        {
            var entity = await _unitOfWork.AdministradorRepository.ObtenerPorCorreoAsync(correo_institucional, cancellationToken);
            return entity is null ? null : AdministradorDataMapper.ToDataModel(entity);
        }

        // =========================
        // COMANDOS
        // =========================
        public async Task<AdministradorDataModel> AgregarAsync(AdministradorDataModel dataModel, CancellationToken cancellationToken = default)
        {
            var entity = AdministradorDataMapper.ToEntity(dataModel);
            
            await _unitOfWork.AdministradorRepository.AgregarAsync(entity, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            return AdministradorDataMapper.ToDataModel(entity);
        }
    }
}
