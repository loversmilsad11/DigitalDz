'use client';

import { useState } from 'react';
import { addKeysToProduct, deleteKey } from '@/lib/admin-actions';
import { Trash2, AlertCircle, PlusCircle, CheckCircle } from 'lucide-react';

export default function KeysManagerClient({ productId, keys }: { productId: string, keys: any[] }) {
  const [newKeys, setNewKeys] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleAddKeys = async () => {
    setMessage(null);
    if (!newKeys.trim()) {
      setMessage({ type: 'error', text: 'يرجى إدخال مفتاح واحد على الأقل' });
      return;
    }

    setLoading(true);
    try {
      const res = await addKeysToProduct(productId, newKeys);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: `تم إضافة ${res.count} مفاتيح بنجاح!` });
        setNewKeys('');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'فشل في الاتصال' });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`هل أنت متأكد من حذف المفتاح "${code}"؟ لا يمكن التراجع عن هذا الإجراء.`)) return;

    try {
      await deleteKey(id);
    } catch (err) {
      alert('فشل الحذف');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '2rem', alignItems: 'start' }}>
      
      {/* Add Keys Box */}
      <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '2rem', border: '1px solid var(--glass-border)' }}>
        <h3 className="title-font" style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlusCircle size={20} color="#e879f9" /> إضافة مفاتيح للمخزون
        </h3>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          قم بإلصاق الأكواد الرقمية هنا. ضع كل مفتاح (Serial / Gift Card) في سطر جديد. سيتم تجاهل الأسطر الفارغة.
        </p>

        <textarea 
          value={newKeys}
          onChange={(e) => setNewKeys(e.target.value)}
          placeholder="XXXXX-XXXXX-XXXXX&#10;YYYYY-YYYYY-YYYYY"
          style={{ width: '100%', minHeight: '180px', padding: '1rem', borderRadius: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontFamily: 'monospace', fontSize: '0.9rem', outline: 'none', resize: 'vertical', marginBottom: '1rem', direction: 'ltr' }}
        />

        {message && (
          <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(52, 211, 153, 0.1)', color: message.type === 'error' ? '#ef4444' : '#34d399', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            {message.text}
          </div>
        )}

        <button 
          onClick={handleAddKeys}
          disabled={loading || !newKeys}
          className="btn-primary"
          style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (loading || !newKeys) ? 0.6 : 1 }}
        >
          {loading ? 'جاري الإضافة...' : 'إضافة الأكواد'}
        </button>
      </div>

      {/* Keys List */}
      <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '2rem', border: '1px solid var(--glass-border)', overflowX: 'auto' }}>
        <h3 className="title-font" style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          قائمة المفاتيح الحالية ({keys.length})
        </h3>
        
        {keys.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--foreground-muted)' }}>لا توجد مفاتيح مُخزنة بعد. المرجو إضافة مفاتيح لتمكين القبول التلقائي للطلبات.</div>
        ) : (
          <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }} dir="rtl">
            <thead style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <tr>
                <th style={{ padding: '1rem', color: 'var(--foreground-muted)', fontWeight: 600, fontSize: '0.85rem' }}>الكود / السيريال</th>
                <th style={{ padding: '1rem', color: 'var(--foreground-muted)', fontWeight: 600, fontSize: '0.85rem' }}>الحالة</th>
                <th style={{ padding: '1rem', color: 'var(--foreground-muted)', fontWeight: 600, fontSize: '0.85rem', textAlign: 'center' }}>الطلب المقترن</th>
                <th style={{ padding: '1rem', color: 'var(--foreground-muted)', fontWeight: 600, fontSize: '0.85rem' }}>خيارات</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '1rem', color: 'white', fontFamily: 'monospace', letterSpacing: '1px', direction: 'ltr', textAlign: 'left' }}>
                    {key.code}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold',
                      backgroundColor: key.status === 'AVAILABLE' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: key.status === 'AVAILABLE' ? '#34d399' : '#ef4444'
                    }}>
                      {key.status === 'AVAILABLE' ? 'متاح' : 'مباع'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--foreground-muted)', fontFamily: 'monospace' }}>
                    {key.orderId ? `#${key.orderId.slice(-8).toUpperCase()}` : '-'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button 
                      onClick={() => handleDelete(key.id, key.code)}
                      title="حذف المفتاح"
                      disabled={key.status === 'SOLD'}
                      style={{ padding: '0.4rem', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', cursor: key.status === 'SOLD' ? 'not-allowed' : 'pointer', opacity: key.status === 'SOLD' ? 0.3 : 1 }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
