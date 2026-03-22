'use client';

import { useState } from 'react';
import { confirmOrder } from '@/lib/admin-actions';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function ConfirmOrderBtn({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!confirm('هل تأكدت من مراجعة وصل الدفع وتريد استلام الطلب؟ ستقوم هذه العملية بسحب مفاتيح عشوائية وإرسالها للمستخدم بطريقة آلية.')) return;

    setLoading(true);
    setError(null);
    
    try {
      const res = await confirmOrder(orderId);
      if (res.error) {
        setError(res.error);
      }
    } catch (err) {
      setError('Internal Error');
    }
    
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <button 
        onClick={handleConfirm}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 1rem',
          backgroundColor: loading ? 'rgba(52, 211, 153, 0.5)' : '#34d399',
          color: 'black',
          fontWeight: 'bold',
          borderRadius: '0.75rem',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          fontSize: '0.85rem'
        }}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
        تأكيد الطلب وتسليم المفاتيح
      </button>
      {error && <span style={{ color: '#f87171', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><AlertCircle size={12} /> {error}</span>}
    </div>
  );
}
