namespace Club.Core.Dtos.Dashboard
{
    public class AdminDashboardDto
    {
        public int TotalMembers { get; set; }
        public int ActiveSubscriptions { get; set; }
        public int TodayBookings { get; set; }
        public int AvailablePitches { get; set; }
        public int TotalCoaches { get; set; }
        public int TotalTeams { get; set; }
        public int TotalActivities { get; set; }
        public decimal Revenue { get; set; }
    }
}
