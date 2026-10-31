import { PitchType } from './enums.model';

export interface PitchDto {
  id: number;
  number: number;
  type: PitchType;
  pricePerHour: number;
  isAvailable: boolean;
  description?: string | null;
  bookingsCount: number;
}

export interface CreatePitchDto {
  number: number;
  type: PitchType;
  pricePerHour: number;
  isAvailable?: boolean | null;
  description?: string | null;
}

export interface UpdatePitchDto {
  number?: number | null;
  type?: PitchType | null;
  pricePerHour?: number | null;
  isAvailable?: boolean | null;
  description?: string | null;
}
