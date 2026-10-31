export interface ActivityDto {
  id: number;
  name: string;
  description?: string | null;
  schedule: string;
  maxCapacity: number;
  isActive: boolean;
  coachId: number;
  coachName?: string | null;
  teamId: number;
  teamName?: string | null;
  teamMembersCount: number;
}

export interface CreateActivityDto {
  name: string;
  description?: string | null;
  schedule: string;
  maxCapacity: number;
  isActive?: boolean | null;
  coachId: number;
  teamId: number;
}

export interface UpdateActivityDto {
  name?: string | null;
  description?: string | null;
  schedule?: string | null;
  maxCapacity?: number | null;
  isActive?: boolean | null;
  coachId?: number | null;
  teamId?: number | null;
}
