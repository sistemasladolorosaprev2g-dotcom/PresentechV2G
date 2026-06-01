using Microsoft.EntityFrameworkCore;
using Presentech.DataAccess.Context;
using Presentech.DataAccess.Entities;
using Presentech.DataAccess.Repositories.Interfaces;

namespace Presentech.DataAccess.Repositories
{
    public class MateriaRepository : IMateriaRepository
    {
        private readonly PresentechDbContext _context;

        public MateriaRepository(PresentechDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MateriaEntity>> GetMateriasAsync()
        {
            return await _context.Materias
                .OrderBy(m => m.Nombre)
                .ToListAsync();
        }

        public async Task<MateriaEntity?> GetMateriaByIdAsync(int id)
        {
            return await _context.Materias
                .FirstOrDefaultAsync(m => m.IdMateria == id);
        }

        public async Task<MateriaEntity?> GetMateriaByNombreAsync(string nombre)
        {
            return await _context.Materias
                .FirstOrDefaultAsync(m => m.Nombre.ToLower() == nombre.ToLower());
        }

        public async Task<MateriaEntity> AddMateriaAsync(MateriaEntity materia)
        {
            _context.Materias.Add(materia);
            await _context.SaveChangesAsync();
            return materia;
        }

        public async Task<MateriaEntity> UpdateMateriaAsync(MateriaEntity materia)
        {
            _context.Materias.Update(materia);
            await _context.SaveChangesAsync();
            return materia;
        }
    }
}
