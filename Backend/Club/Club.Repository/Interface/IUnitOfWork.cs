using Club.Core.Entities;

namespace Club.Repository.Interface
{
    public interface IUnitOfWork : IDisposable
    {
        // ─── Repositories ─────────────────────────────────────────
        IGenericRepository<Coach> Coaches { get; }
        IGenericRepository<Member> Members { get; }
        IGenericRepository<Team> Teams { get; }
        IGenericRepository<Plan> Plans { get; }
        IGenericRepository<Subscription> Subscriptions { get; }
        IGenericRepository<Activity> Activities { get; }
        IGenericRepository<Pitch> Pitches { get; }
        IGenericRepository<Booking> Bookings { get; }
        IGenericRepository<JoinRequest> JoinRequests { get; }
        IGenericRepository<TEntity> Repository<TEntity>() where TEntity : class;

        // ─── Save ─────────────────────────────────────────────────
        Task<int> CompleteAsync();
    }
}
