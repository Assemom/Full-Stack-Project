using Club.Core.Entities;
using Club.Repository.Data.Context;
using Club.Repository.Interface;

namespace Club.Repository.Implementation
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ClubContext _context;

        // ─── Private backing fields ───────────────────────────────
        private IGenericRepository<Coach>? _coaches;
        private IGenericRepository<Member>? _members;
        private IGenericRepository<Team>? _teams;
        private IGenericRepository<Plan>? _plans;
        private IGenericRepository<Subscription>? _subscriptions;
        private IGenericRepository<Activity>? _activities;
        private IGenericRepository<Pitch>? _pitches;
        private IGenericRepository<Booking>? _bookings;
        private IGenericRepository<JoinRequest>? _joinRequests;
        private readonly Dictionary<Type, object> _repositories = new();


        public UnitOfWork(ClubContext context)
        {
            _context = context;
        }

        // ─── Lazy initialization ──────────────────────────────────
        public IGenericRepository<Coach> Coaches
            => _coaches ??= new GenericRepository<Coach>(_context);

        public IGenericRepository<Member> Members
            => _members ??= new GenericRepository<Member>(_context);

        public IGenericRepository<Team> Teams
            => _teams ??= new GenericRepository<Team>(_context);

        public IGenericRepository<Plan> Plans
            => _plans ??= new GenericRepository<Plan>(_context);

        public IGenericRepository<Subscription> Subscriptions
            => _subscriptions ??= new GenericRepository<Subscription>(_context);

        public IGenericRepository<Activity> Activities
            => _activities ??= new GenericRepository<Activity>(_context);

        public IGenericRepository<Pitch> Pitches
            => _pitches ??= new GenericRepository<Pitch>(_context);

        public IGenericRepository<Booking> Bookings
            => _bookings ??= new GenericRepository<Booking>(_context);

        public IGenericRepository<JoinRequest> JoinRequests
            => _joinRequests ??= new GenericRepository<JoinRequest>(_context);

        // ─── Save ─────────────────────────────────────────────────
        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        // ─── Dispose ──────────────────────────────────────────────
        public void Dispose()
        {
            _context.Dispose();
        }
        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : class
        {
            var type = typeof(TEntity);
            if (!_repositories.ContainsKey(type))
                _repositories[type] = new GenericRepository<TEntity>(_context);

            return (IGenericRepository<TEntity>)_repositories[type];
        }
    }
}
