export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid';
export type PitchType = 'Football' | 'Basketball' | 'Padel';
export type SubscriptionStatus = 'Pending' | 'Active' | 'Inactive' | 'Expired';

export const BOOKING_STATUSES: BookingStatus[] = ['Pending', 'Confirmed', 'Cancelled'];
export const PAYMENT_STATUSES: PaymentStatus[] = ['Pending', 'Paid'];
export const PITCH_TYPES: PitchType[] = ['Football', 'Basketball', 'Padel'];
export const SUBSCRIPTION_STATUSES: SubscriptionStatus[] = ['Pending', 'Active', 'Inactive', 'Expired'];
export const TEAM_TYPES = ['Football', 'Basketball', 'Swimming', 'Padel'] as const;
export const PLAN_TYPES = ['Monthly', 'Yearly'] as const;
export type JoinRequestStatus = 'Pending' | 'Approved' | 'Rejected';
export const JOIN_REQUEST_STATUSES: JoinRequestStatus[] = ['Pending', 'Approved', 'Rejected'];
