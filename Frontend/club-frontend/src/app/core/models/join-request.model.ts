export interface JoinRequestDto {
  id: number;
  memberId: number;
  memberName: string;
  memberEmail: string;
  teamId?: number | null;
  teamName?: string | null;
  activityId?: number | null;
  activityName?: string | null;
  status: string;
  createdAt: string;
  respondedAt?: string | null;
  responseNote?: string | null;
}

export interface CreateJoinRequestDto {
  teamId?: number | null;
  activityId?: number | null;
}

export interface RespondJoinRequestDto {
  status: string;
  note?: string | null;
}
