export interface PlanDto {
  id: number;
  name: string;
  type: string;
  price: number;
  durationMonths: number;
  isActive: boolean;
  subscriptionsCount: number;
}

export interface CreatePlanDto {
  name: string;
  type: string;
  price: number;
  durationMonths: number;
  isActive?: boolean | null;
}

export interface UpdatePlanDto {
  name?: string | null;
  type?: string | null;
  price?: number | null;
  durationMonths?: number | null;
  isActive?: boolean | null;
}
