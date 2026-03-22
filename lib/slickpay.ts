import axios, { AxiosError } from 'axios';

/**
 * SlickPay API Wrapper for Quick Integration
 * Implementation based on: https://developers.slick-pay.com/quick-integration
 */

// Configuration
const API_URL = process.env.SLICKPAY_API_URL || 'https://devapi.slick-pay.com/api/v2';
// For server-side calls, SlickPay usually expects the "API Key" which starts with numbers (e.g. 41155|...)
// Use SLICKPAY_PUBLIC_KEY as the primary bearer token if SLICKPAY_SECRET_KEY is just for signing.
// However, many users use SLICKPAY_SECRET_KEY as the bearer token. Let's provide a way to use both.
const API_TOKEN = process.env.SLICKPAY_PUBLIC_KEY || '';

export class SlickPayError extends Error {
  statusCode: number;
  errors?: any;
  rawResponse?: any;

  constructor(message: string, statusCode: number, errors?: any, rawResponse?: any) {
    super(message);
    this.name = 'SlickPayError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.rawResponse = rawResponse;
  }
}

/**
 * Check if SlickPay is configured
 */
export const isSlickPayConfigured = () => {
  return !!API_TOKEN && API_TOKEN !== 'YOUR_KEY_HERE';
};

/**
 * Create a SlickPay Invoice (SATIM / CIB / Edahabia Payment)
 */
export async function createInvoice({
  amount,
  url,
  items,
  cancel_url,
}: {
  amount: number;
  url: string; // success_url
  items: Array<{ name: string; price: number; quantity: number }>;
  cancel_url?: string;
}) {
  try {
    const SECRET_KEY = (process.env.SLICKPAY_SECRET_KEY || '').trim();
    const API_URL = process.env.SLICKPAY_API_URL || 'https://devapi.slick-pay.com/api/v2';
    
    console.log('[SlickPay] Attempting to create invoice (New Format):', { amount });

    // 1) Prepare Payload according to user request
    const payload = {
      amount: Math.round(amount),
      currency: "DZD",
      success_url: url,
      cancel_url: cancel_url || url, // Default to success URL if not provided
      items: items.map(item => ({
        name: item.name,
        unit_price: Math.round(item.price),
        quantity: item.quantity || 1,
      })),
    };

    console.log('[SlickPay] Payload:', JSON.stringify(payload, null, 2));

    // 2) Execution - Using /invoices endpoint
    const response = await axios.post(
      `${API_URL}/invoices`, 
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': SECRET_KEY,
        },
        timeout: 10000,
      }
    );

    const result = response.data;
    console.log('[SlickPay] Response Success:', result);

    if (result.success === false) {
      throw new SlickPayError(result.msg || 'SlickPay reported failure', 400, result.errors, result);
    }

    // Adapt response to our expected format
    return {
      id: result.data?.id || result.id,
      url: result.data?.url || result.url,
      invoice_id: result.data?.invoice_id || result.invoice_id,
      raw: result.data || result
    };

  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      console.error('[SlickPay] Axios Error Context:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        headers: axiosError.response?.headers,
        message: axiosError.message
      });

      const message = axiosError.response?.data?.msg || axiosError.response?.data?.message || axiosError.message;
      const status = axiosError.response?.status || 500;
      const errors = axiosError.response?.data?.errors;

      throw new SlickPayError(`SlickPay: ${message}`, status, errors, axiosError.response?.data);
    }

    console.error('[SlickPay] Unexpected Error:', error);
    throw new SlickPayError(error.message || 'Unexpected communication error', 500);
  }
}

/**
 * Check the status of a specific invoice
 * @param invoiceId The ID received during invoice creation
 */
export async function checkPaymentStatus(invoiceId: string | number) {
  try {
    console.log(`[SlickPay] Checking status for invoice: ${invoiceId}`);
    
    const response = await axios.get(`${API_URL}/users/invoices/${invoiceId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': (process.env.SLICKPAY_SECRET_KEY || '').trim(),
      },
    });

    const result = response.data;
    const data = result.data;
    
    // payment_status: 'paid' or 'unpaid'
    const status = (data.payment_status || '').toLowerCase();
    
    return {
      isPaid: status === 'paid',
      status: status,
      amount: data.amount,
      invoiceNum: data.invoice_id,
      updatedAt: data.updated_at,
      raw: data
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('[SlickPay] Status check failed:', error.response?.data || error.message);
    } else {
      console.error('[SlickPay] Unexpected status check error:', error);
    }
    return { isPaid: false, status: 'error' };
  }
}

/**
 * Generate the Iframe URL for embedded payments
 */
export function getIframeUrl(invoiceId: number, locale: string = 'ar') {
  const isSandbox = process.env.SLICKPAY_SANDBOX === 'true';
  const domain = isSandbox ? 'https://devapi.slick-pay.com' : 'https://api.slick-pay.com';
  return `${domain}/payment-iframe/${invoiceId}?locale=${locale}`;
}

