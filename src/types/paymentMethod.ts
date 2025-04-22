
export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_account';
  cardLast4?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
  cardBrand?: string;
  bankName?: string;
  accountLast4?: string;
  isPrimary?: boolean;
  details?: Record<string, any>;
}

export interface PaymentMethodFormData {
  type: 'credit_card' | 'bank_account';
  cardNumber?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  isPrimary?: boolean;
}
