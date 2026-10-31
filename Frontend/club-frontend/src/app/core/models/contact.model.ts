export interface CreateContactInquiryDto {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
}