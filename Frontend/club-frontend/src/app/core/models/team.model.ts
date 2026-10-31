export interface TeamDto {
  id: number;
  name: string;
  type: string;
  createdAt: string;
  coachId?: number | null;
  coachName?: string | null;
  coachSpecialization?: string | null;
  membersCount: number;
}

export interface CreateTeamDto {
  name: string;
  type: string;
  coachId?: number | null;
}

export interface UpdateTeamDto {
  name?: string | null;
  type?: string | null;
  coachId?: number | null;
}
