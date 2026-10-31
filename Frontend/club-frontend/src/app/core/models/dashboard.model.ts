export interface AdminDashboardDto {
  totalMembers: number;
  activeSubscriptions: number;
  todayBookings: number;
  availablePitches: number;
  totalCoaches: number;
  totalTeams: number;
  totalActivities: number;
  revenue: number;
}

export interface MemberDashboardDto {
  myBookings: number;
  mySubscriptions: number;
  totalActivities: number;
  availablePitches: number;
}

export interface CoachDashboardDto {
  myActivities: number;
  myBookings: number;
  myTeams: number;
}
