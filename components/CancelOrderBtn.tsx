'use client';

import { useState } from 'react';
import { cancelOrder } from '@/lib/admin-actions';
import { XCircle, Loader2, AlertCircle } from 'lucide-react';

export default function CancelOrderBtn({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    if (!confirm('هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟ (إذا تم تسليم المفاتيح سيتم سحبها وإعادتها للمخزون)')) return;

    setLoading(true);
    setError(null);
    
    try {
      const res = await cancelOrder(orderId);
      if (res?.error) {
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
        onClick={handleCancel}
        disabled={loading}
        title="إلغاء الطلب"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 1rem',
          backgroundColor: loading ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          fontWeight: 'bold',
          borderRadius: '0.75rem',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          fontSize: '0.85rem'
        }}
        onMouseEnter={(e) => {
          if (!loading) e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
        }}
        onMouseLeave={(e) => {
          if (!loading) e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        }}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
        إلغاء الطلب
      </button>
      {error && <span style={{ color: '#f87171', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><AlertCircle size={12} /> {error}</span>}
    </div>
  );
}
