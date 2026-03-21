import axios from 'axios';

/**
 * SlickPay API Wrapper for Quick Integration
 * Implementation based on: https://developers.slick-pay.com/quick-integration
 */

const API_URL = process.env.SLICKPAY_API_URL || 'https://devapi.slick-pay.com/api/v2';
const PUBLIC_KEY = process.env.SLICKPAY_PUBLIC_KEY || '';

export class SlickPayError extends Error {
  statusCode: number;
  errors?: any;

  constructor(message: string, statusCode: number, errors?: any) {
    super(message);
    this.name = 'SlickPayError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

/**
 * Check if SlickPay is configured
 */
export const isSlickPayConfigured = () => {
  return !!PUBLIC_KEY && PUBLIC_KEY !== 'YOUR_KEY_HERE';
};

/**
 * Create a SlickPay Invoice (SATIM Payment)
 * @param amount Total amount in DZD
 * @param url Redirect URL after payment completion
 * @param items List of products { name, price, quantity }
 */
export async function createInvoice({
  amount,
  url,
  items,
}: {
  amount: number;
  url: string;
  items: Array<{ name: string; price: number; quantity: number }>;
}) {
  try {
    const response = await axios.post(
      `${API_URL}/users/invoices`,
      {
        amount,
        url,
        items,
        // Optional: contact can be added if you have a contact ID from SlickPay contacts API
      },
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${PUBLIC_KEY}`,
        },
      }
    );

    // According to Quick Integration guide, data is in response.data.data or result.data
    // If using axios, result.data is the body, and typically SlickPay returns { success, data: { url, ... } }
    const result = response.data;
    
    if (result.success === false) {
      throw new SlickPayError(result.msg || 'Failed to create invoice', 400, result.errors);
    }

    return {
      id: result.data.id,
      url: result.data.url, // This is the SATIM payment URL
      invoice_id: result.data.invoice_id,
    };
  } catch (error: any) {
    if (error.response) {
      throw new SlickPayError(
        error.response.data?.msg || 'SlickPay API Error',
        error.response.status,
        error.response.data?.errors
      );
    }
    throw error;
  }
}

/**
 * Check the status of a specific invoice
 * @param invoiceId The ID received during invoice creation
 */
export async function checkPaymentStatus(invoiceId: string | number) {
  try {
    const response = await axios.get(`${API_URL}/users/invoices/${invoiceId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${PUBLIC_KEY}`,
      },
    });

    const result = response.data;
    
    // Quick Integration Guide says paymentStatus is in response.data.data.payment_status
    // Values: 'paid' or 'unpaid'
    const paymentStatus = result.data.payment_status;
    
    return {
      isPaid: paymentStatus === 'paid',
      status: paymentStatus,
      amount: result.data.amount,
      invoiceNum: result.data.invoice_id
    };
  } catch (error: any) {
    console.error('[SlickPay] Status check error:', error.message);
    return { isPaid: false, status: 'error' };
  }
}

/**
 * Calculate the commission (Optional helper)
 */
export async function calculateCommission(amount: number) {
  try {
    const response = await axios.get(`${API_URL}/users/commission?amount=${amount}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${PUBLIC_KEY}`,
      },
    });
    return response.data.data;
  } catch (error) {
    return null;
  }
}

/**
 * Get iFrame URL if needed for QR code payments
 */
export function getIframeUrl(invoiceId: number, locale: string = 'fr') {
  const isSandbox = process.env.SLICKPAY_SANDBOX === 'true';
  const baseUrl = isSandbox ? 'https://devapi.slick-pay.com' : 'https://api.slick-pay.com';
  return `${baseUrl}/payment-iframe/${invoiceId}?locale=${locale}`;
}
