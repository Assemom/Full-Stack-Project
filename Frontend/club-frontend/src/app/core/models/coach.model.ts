export interface CoachDto {
  id: number;
  appUserId: string;
  userName: string;
  email: string;
  phoneNumber?: string | null;
  fullName?: string | null;
  address?: string | null;
  imageUrl?: string | null;
  specialization: string;
  bio?: string | null;
  hireDate: string;
}

export interface CreateCoachDto {
  email: string;
  password: string;
  userName: string;
  phoneNumber?: string | null;
  fullName?: string | null;
  address?: string | null;
  specialization: string;
  bio?: string | null;
}

export interface UpdateCoachDto {
  fullName?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  specialization?: string | null;
  bio?: string | null;
}
