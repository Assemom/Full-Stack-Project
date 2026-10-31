export interface AdminUserDto {
  id: string;
  userName: string;
  email: string;
  phoneNumber?: string | null;
  fullName?: string | null;
  imageUrl?: string | null;
  roles: string[];
  isLockedOut: boolean;
  lockoutEnd?: string | null;
}
