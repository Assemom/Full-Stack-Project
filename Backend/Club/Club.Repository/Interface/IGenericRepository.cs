using Club.Core.Dtos;
using System.Linq.Expressions;

namespace Club.Repository.Interface
{
    public interface IGenericRepository<T> where T : class
    {
        // ─── Query ────────────────────────────────────────────────
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);

        // ─── Query with Includes ──────────────────────────────────
        Task<IEnumerable<T>> GetAllWithIncludesAsync(
            params Expression<Func<T, object>>[] includes);

        Task<T?> GetByIdWithIncludesAsync(
            int id,
            params Expression<Func<T, object>>[] includes);

        // ─── Command ──────────────────────────────────────────────
        Task AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity);

        // ─── Pagination ───────────────────────────────────────────
        Task<PagedResult<T>> GetAllPagedAsync(int page, int pageSize,
            Expression<Func<T, bool>>? filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
            params Expression<Func<T, object>>[] includes);

        // ─── Utility ──────────────────────────────────────────────
        Task<bool> ExistsAsync(int id);
    }
}