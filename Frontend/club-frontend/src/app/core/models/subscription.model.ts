import { PaymentStatus, SubscriptionStatus } from './enums.model';

export interface SubscriptionDto {
  id: number;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  memberId: number;
  memberName?: string | null;
  planId: number;
  planName: string;
  planType: string;
  planPrice: number;
  durationMonths: number;
}

export interface CreateSubscriptionDto {
  memberId: number;
  planId: number;
  startDate?: string | null;
  amountPaid?: number | null;
  status?: SubscriptionStatus | null;
  paymentStatus?: PaymentStatus | null;
}

export interface UpdateSubscriptionDto {
  memberId?: number | null;
  planId?: number | null;
  startDate?: string | null;
  amountPaid?: number | null;
  status?: SubscriptionStatus | null;
  paymentStatus?: PaymentStatus | null;
}
