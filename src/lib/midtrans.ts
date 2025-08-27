// Simple Midtrans Configuration
export const MIDTRANS_CONFIG = {
  // Use sandbox for testing, change to production for live payments
  isProduction: false,
  
  // Your Midtrans credentials (get these from Midtrans dashboard)
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
  
  // Base URLs
  snapUrl: 'https://app.sandbox.midtrans.com/snap/v1/transactions',
  apiUrl: 'https://api.sandbox.midtrans.com/v2',
};

// Payment status interface
export interface PaymentStatus {
  transaction_status: string;
  fraud_status: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  va_numbers?: Array<{
    bank: string;
    va_number: string;
  }>;
  bank?: string;
  bill_key?: string;
  biller_code?: string;
  permata_va_number?: string;
  signature_key?: string;
  status_code?: string;
  status_message?: string;
  finish_redirect_url?: string;
  error_code?: string;
  error_message?: string;
}

// Get payment instructions for bank transfer
export const getPaymentInstructions = (paymentStatus: PaymentStatus): string[] => {
  const instructions: string[] = [];
  
  if (paymentStatus.payment_type === 'bank_transfer') {
    instructions.push('1. Transfer the exact amount to the virtual account number below');
    instructions.push('2. Use your Order ID as the transfer reference');
    instructions.push('3. Complete the transfer within 24 hours');
    instructions.push('4. Payment will be confirmed automatically');
  }
  
  if (paymentStatus.va_numbers && paymentStatus.va_numbers.length > 0) {
    instructions.push('');
    instructions.push('Virtual Account Numbers:');
    paymentStatus.va_numbers.forEach((va, index) => {
      instructions.push(`${index + 1}. ${va.bank.toUpperCase()}: ${va.va_number}`);
    });
  }
  
  return instructions;
};

// Format payment amount
export const formatPaymentAmount = (amount: string | number): string => {
  const numAmount = typeof amount === 'string' ? parseInt(amount) : amount;
  return `Rp ${numAmount.toLocaleString()}`;
};

// Get payment status description
export const getPaymentStatusDescription = (status: string): string => {
  switch (status) {
    case 'settlement':
    case 'capture':
      return 'Payment has been successfully processed and confirmed.';
    case 'pending':
      return 'Payment is pending. Please complete your bank transfer.';
    case 'deny':
      return 'Payment was denied by the payment provider.';
    case 'expire':
      return 'Payment has expired. Please try again.';
    case 'cancel':
      return 'Payment was cancelled.';
    default:
      return 'Payment status is unknown.';
  }
};
