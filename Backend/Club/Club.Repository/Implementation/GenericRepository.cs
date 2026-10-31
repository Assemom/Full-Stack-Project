using Club.Core.Dtos;
using Club.Repository.Data.Context;
using Club.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Club.Repository.Implementation
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly ClubContext _context;
        private readonly DbSet<T> _dbSet;

        public GenericRepository(ClubContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        // ─── Query ────────────────────────────────────────────────
        public async Task<IEnumerable<T>> GetAllAsync()
            => await _dbSet.ToListAsync();

        public async Task<T?> GetByIdAsync(int id)
            => await _dbSet.FindAsync(id);

        // ─── Query with Includes ──────────────────────────────────
        public async Task<IEnumerable<T>> GetAllWithIncludesAsync(
            params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _dbSet;

            foreach (var include in includes)
                query = query.Include(include);

            return await query.ToListAsync();
        }

        public async Task<T?> GetByIdWithIncludesAsync(
            int id,
            params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _dbSet;

            foreach (var include in includes)
                query = query.Include(include);

            return await query.FirstOrDefaultAsync(e =>
                EF.Property<int>(e, "Id") == id);
        }

        // ─── Command ──────────────────────────────────────────────
        public async Task AddAsync(T entity)
            => await _dbSet.AddAsync(entity);

        public void Update(T entity)
            => _dbSet.Update(entity);

        public void Delete(T entity)
            => _dbSet.Remove(entity);

        // ─── Pagination ───────────────────────────────────────────
        public async Task<PagedResult<T>> GetAllPagedAsync(int page, int pageSize,
            Expression<Func<T, bool>>? filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
            params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _dbSet;

            foreach (var include in includes)
                query = query.Include(include);

            if (filter is not null)
                query = query.Where(filter);

            var totalCount = await query.CountAsync();

            if (orderBy is not null)
                query = orderBy(query);

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<T>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
            };
        }

        // ─── Utility ──────────────────────────────────────────────
        public async Task<bool> ExistsAsync(int id)
            => await _dbSet.FindAsync(id) is not null;
    }
}
