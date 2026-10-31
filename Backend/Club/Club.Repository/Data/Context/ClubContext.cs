using Club.Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Club.Repository.Data.Context
{

    public class ClubContext : IdentityDbContext<AppUser>
    {
        public ClubContext(DbContextOptions<ClubContext> options) : base(options) { }

        // ─── DbSets ───────────────────────────────────────────────
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Coach> Coaches { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Plan> Plans { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<Pitch> Pitches { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<JoinRequest> JoinRequests { get; set; }
        public DbSet<MemberActivity> MemberActivities { get; set; }
        public DbSet<ContactInquiry> ContactInquiries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ─── UserProfile ──────────────────────────────────────
            modelBuilder.Entity<UserProfile>(entity =>
            {
                entity.HasKey(p => p.AppUserId);
                entity.HasOne(p => p.AppUser)
                      .WithOne(u => u.UserProfile)
                      .HasForeignKey<UserProfile>(p => p.AppUserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ─── Coach ────────────────────────────────────────────
            modelBuilder.Entity<Coach>(entity =>
            {
                entity.HasOne(c => c.AppUser)
                      .WithOne()
                      .HasForeignKey<Coach>(c => c.AppUserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ─── Member ───────────────────────────────────────────
            modelBuilder.Entity<Member>(entity =>
            {
                entity.HasOne(m => m.AppUser)
                      .WithOne()
                      .HasForeignKey<Member>(m => m.AppUserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(m => m.Team)
                      .WithMany(t => t.Members)
                      .HasForeignKey(m => m.TeamId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // ─── Team ─────────────────────────────────────────────
            modelBuilder.Entity<Team>(entity =>
            {
                entity.HasOne(t => t.Coach)
                      .WithMany(c => c.Teams)
                      .HasForeignKey(t => t.CoachId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // ─── Activity ─────────────────────────────────────────
            modelBuilder.Entity<Activity>(entity =>
            {
                entity.HasOne(a => a.Coach)
                      .WithMany(c => c.Activities)
                      .HasForeignKey(a => a.CoachId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(a => a.Team)
                      .WithMany(t => t.Activities)
                      .HasForeignKey(a => a.TeamId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ─── Subscription ─────────────────────────────────────
            modelBuilder.Entity<Subscription>(entity =>
            {
                entity.HasOne(s => s.Member)
                      .WithMany(m => m.Subscriptions)
                      .HasForeignKey(s => s.MemberId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(s => s.Plan)
                      .WithMany(p => p.Subscriptions)
                      .HasForeignKey(s => s.PlanId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ─── Booking ──────────────────────────────────────────
            modelBuilder.Entity<Booking>(entity =>
            {
                entity.Property(b => b.Status).HasConversion<string>();

                entity.HasOne(b => b.Member)
                      .WithMany(m => m.Bookings)
                      .HasForeignKey(b => b.MemberId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(b => b.Pitch)
                      .WithMany(p => p.Bookings)
                      .HasForeignKey(b => b.PitchId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(b => b.Coach)
                      .WithMany(c => c.Bookings)
                      .HasForeignKey(b => b.CoachId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // ─── JoinRequest ────────────────────────────────────────
            modelBuilder.Entity<JoinRequest>(entity =>
            {
                entity.HasOne(j => j.Member)
                      .WithMany(m => m.JoinRequests)
                      .HasForeignKey(j => j.MemberId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(j => j.Team)
                      .WithMany()
                      .HasForeignKey(j => j.TeamId)
                      .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(j => j.Activity)
                      .WithMany()
                      .HasForeignKey(j => j.ActivityId)
                      .OnDelete(DeleteBehavior.NoAction);

                entity.Property(j => j.Status).HasConversion<string>();
            });

            // ─── MemberActivity ─────────────────────────────────────
            modelBuilder.Entity<MemberActivity>(entity =>
            {
                entity.HasOne(ma => ma.Member)
                      .WithMany()
                      .HasForeignKey(ma => ma.MemberId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ma => ma.Activity)
                      .WithMany()
                      .HasForeignKey(ma => ma.ActivityId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(ma => new { ma.MemberId, ma.ActivityId }).IsUnique();
            });

            // ─── Pitch ─────────────────────────────────────────────
            modelBuilder.Entity<Pitch>(entity =>
            {
                entity.HasIndex(p => p.Number).IsUnique();
                entity.Property(p => p.Type).HasConversion<string>();
            });
        }
    }

}
