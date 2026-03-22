'use client';

import { useState } from 'react';
import { deleteOrder } from '@/lib/admin-actions';
import { Trash2, Loader2 } from 'lucide-react';

export default function TrashOrderBtn({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('سيتم حذف هذا الطلب نهائياً من قاعدة البيانات! هل أنت متأكد؟')) return;

    setLoading(true);
    try {
      await deleteOrder(orderId);
    } catch (err) {
      alert('حدث خطأ أثناء الحذف');
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      title="حذف نهائي للطلب الملغى"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        backgroundColor: loading ? 'transparent' : 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        borderRadius: '50%',
        border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!loading) e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
      }}
      onMouseLeave={(e) => {
        if (!loading) e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
      }}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}
