export interface MemberDto {
  id: number;
  appUserId: string;
  userName: string;
  email: string;
  phoneNumber?: string | null;
  fullName?: string | null;
  address?: string | null;
  imageUrl?: string | null;
  teamId?: number | null;
  teamName?: string | null;
  subscriptionStatus?: string | null;
  joinedAt: string;
}

export interface CreateMemberDto {
  email: string;
  password: string;
  userName?: string | null;
  phoneNumber?: string | null;
  fullName?: string | null;
  address?: string | null;
  teamId?: number | null;
}

export interface UpdateMemberDto {
  fullName?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  teamId?: number | null;
}
