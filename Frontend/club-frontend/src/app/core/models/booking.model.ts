import { BookingStatus } from './enums.model';

export interface BookingDto {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalPrice: number;
  createdAt: string;
  memberId: number;
  memberName?: string | null;
  pitchId: number;
  pitchNumber: number;
  pitchType: string;
  pricePerHour: number;
  coachId?: number | null;
  coachName?: string | null;
}

export interface CreateBookingDto {
  date: string;
  startTime: string;
  endTime: string;
  memberId: number;
  pitchId: number;
  coachId?: number | null;
  status?: BookingStatus | null;
}

export interface UpdateBookingDto {
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  memberId?: number | null;
  pitchId?: number | null;
  coachId?: number | null;
  status?: BookingStatus | null;
}
