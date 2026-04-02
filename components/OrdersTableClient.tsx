'use client';

import { useState } from 'react';
import { ShoppingBag, Calendar, User, Zap, Circle, CheckSquare, Trash2, CheckCircle2 } from 'lucide-react';
import ConfirmOrderBtn from './ConfirmOrderBtn';
import CancelOrderBtn from './CancelOrderBtn';
import TrashOrderBtn from './TrashOrderBtn';
import { confirmOrder, deleteOrder, cancelOrder } from '@/lib/admin-actions';

export default function OrdersTableClient({ initialOrders }: { initialOrders: any[] }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === initialOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(initialOrders.map(o => o.id)));
    }
  };

  const selectedOrdersData = initialOrders.filter(o => selectedIds.has(o.id));
  const canBulkConfirm = selectedOrdersData.some(o => o.status === 'PENDING');
  const canBulkDelete = selectedOrdersData.some(o => o.status === 'CANCELLED');
  const canBulkCancel = selectedOrdersData.some(o => o.status === 'PENDING' || o.status === 'COMPLETED');

  const handleBulkAction = async (actionType: 'confirm' | 'delete' | 'cancel') => {
    if (selectedIds.size === 0) return;
    
    let message = '';
    if (actionType === 'confirm') message = `هل أنت متأكد من تأكيد ${selectedIds.size} طلب وتسليم مفاتيحهم؟`;
    else if (actionType === 'delete') message = `سيتم حذف ${selectedIds.size} طلب نهائياً. متأكد؟`;
    else if (actionType === 'cancel') message = `سيتم إلغاء ${selectedIds.size} طلب وسحب مفاتيحهم إن وجدت. متأكد؟`;
    
    if (!confirm(message)) return;

    setLoadingAction(actionType);
    const ids = Array.from(selectedIds);
    
    try {
      if (actionType === 'confirm') {
        const pendingIds = ids.filter(id => initialOrders.find(o => o.id === id)?.status === 'PENDING');
        for (const id of pendingIds) await confirmOrder(id);
      } else if (actionType === 'delete') {
        const cancelledIds = ids.filter(id => initialOrders.find(o => o.id === id)?.status === 'CANCELLED');
        for (const id of cancelledIds) await deleteOrder(id);
      } else if (actionType === 'cancel') {
        const activeIds = ids.filter(id => {
          const s = initialOrders.find(o => o.id === id)?.status;
          return s === 'PENDING' || s === 'COMPLETED';
        });
        for (const id of activeIds) await cancelOrder(id);
      }
      setSelectedIds(new Set());
    } catch (err) {
      alert('حدث خطأ أثناء تنفيذ الإجراء الشامل');
    }
    setLoadingAction(null);
  };

  if (initialOrders.length === 0) {
    return (
      <div className="glass-morphism" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '2rem', border: '1px solid var(--glass-border)' }}>
        <ShoppingBag size={48} style={{ color: 'var(--foreground-muted)', margin: '0 auto 1rem', opacity: 0.5 }} />
        <h3 className="title-font" style={{ fontSize: '1.25rem', color: 'white' }}>لا توجد أي طلبات حالياً</h3>
      </div>
    );
  }

  return (
    <div className="glass-morphism admin-table-container" style={{ padding: '1.5rem', borderRadius: '2rem', border: '1px solid var(--glass-border)', overflowX: 'auto' }}>
      
      {/* Bulk Actions Toolbar */}
      {selectedIds.size > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '1rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ color: 'white', fontWeight: 'bold' }}>
            تم تحديد {selectedIds.size} عناصر
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {canBulkConfirm && (
              <button 
                onClick={() => handleBulkAction('confirm')} disabled={loadingAction !== null}
                style={{ padding: '0.5rem 1rem', background: '#34d399', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '0.5rem', cursor: loadingAction ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <CheckCircle2 size={16} /> تأكيد المحدد
              </button>
            )}
            {canBulkCancel && (
              <button 
                onClick={() => handleBulkAction('cancel')} disabled={loadingAction !== null}
                style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontWeight: 'bold', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '0.5rem', cursor: loadingAction ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                إلغاء المحدد
              </button>
            )}
            {canBulkDelete && (
              <button 
                onClick={() => handleBulkAction('delete')} disabled={loadingAction !== null}
                style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '0.5rem', cursor: loadingAction ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Trash2 size={16} /> حذف المحدد نهائياً
              </button>
            )}
          </div>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <th style={{ padding: '1.5rem 1rem', width: '40px' }}>
              <input type="checkbox" checked={selectedIds.size === initialOrders.length && initialOrders.length > 0} onChange={toggleAll} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }} />
            </th>
            <th style={{ padding: '1.5rem 1rem', color: 'var(--foreground-muted)', fontWeight: 600, fontSize: '0.9rem' }}>الطلب والعميل</th>
            <th style={{ padding: '1.5rem 1rem', color: 'var(--foreground-muted)', fontWeight: 600, fontSize: '0.9rem' }}>المنتجات المطلوبة</th>
            <th style={{ padding: '1.5rem 1rem', color: 'var(--foreground-muted)', fontWeight: 600, fontSize: '0.9rem' }}>إثبات التحويل</th>
            <th style={{ padding: '1.5rem 1rem', color: 'var(--foreground-muted)', fontWeight: 600, fontSize: '0.9rem' }}>المبلغ والحالة</th>
            <th style={{ padding: '1.5rem 1rem', color: 'var(--foreground-muted)', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>الإجراء المتخذ</th>
          </tr>
        </thead>
        <tbody>
          {initialOrders.map((order) => (
            <tr 
              key={order.id} 
              style={{ 
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                backgroundColor: selectedIds.has(order.id) ? 'rgba(99, 102, 241, 0.05)' : order.status === 'PENDING' ? 'rgba(251, 191, 36, 0.03)' : order.status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.02)' : 'transparent',
                transition: 'background 0.2s'
              }}
            >
              <td style={{ padding: '1.5rem 1rem' }}>
                <input 
                  type="checkbox" 
                  checked={selectedIds.has(order.id)} 
                  onChange={() => toggleSelect(order.id)} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }} 
                />
              </td>
              {/* Order & Customer */}
              <td style={{ padding: '1.5rem 1rem', verticalAlign: 'top' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>#{order.id.slice(-8).toUpperCase()}</span>
                  <strong style={{ color: 'white', fontSize: '1.05rem' }}>{order.customerName || order.user?.name || 'عميل'}</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>
                    <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString('ar-DZ')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--foreground-muted)', direction: 'ltr', justifyContent: 'flex-end', width: 'max-content' }}>
                    {order.customerPhone || order.customerEmail || 'لا يوجد اتصال'}
                  </div>
                </div>
              </td>

              {/* Order Items */}
              <td style={{ padding: '1.5rem 1rem', verticalAlign: 'top' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {order.items.map((item: any) => (
                    <div key={item.id} style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{item.quantity}x</span> {item.product?.nameAr}
                    </div>
                  ))}
                </div>
              </td>

              {/* Payment Data */}
              <td style={{ padding: '1.5rem 1rem', verticalAlign: 'top' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Zap size={14} /> {order.paymentMethod || 'آخرى'}
                  </span>
                  {order.paymentId ? (
                    <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600, display: 'inline-block', padding: '0.3rem 0.6rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                      {order.paymentId}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>لا يوجد وصل</span>
                  )}
                </div>
              </td>

              {/* Status & Amount */}
              <td style={{ padding: '1.5rem 1rem', verticalAlign: 'top' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'white' }}>
                    {Number(order.total).toLocaleString()} <span style={{ fontSize: '0.8rem' }}>د.ج</span>
                  </span>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.3rem',
                    fontSize: '0.75rem', 
                    fontWeight: 'bold', 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '1rem', 
                    width: 'fit-content',
                    backgroundColor: order.status === 'PENDING' ? 'rgba(251, 191, 36, 0.1)' : order.status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(52, 211, 153, 0.1)',
                    color: order.status === 'PENDING' ? '#fbbf24' : order.status === 'CANCELLED' ? '#ef4444' : '#34d399'
                  }}>
                    <Circle size={10} fill="currentColor" />
                    {order.status === 'PENDING' ? 'قيد المراجعة' : order.status === 'CANCELLED' ? 'مُلغى' : 'تم التسليم'}
                  </span>
                </div>
              </td>

              {/* Actions */}
              <td style={{ padding: '1.5rem 1rem', verticalAlign: 'top', textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '0 auto', maxWidth: '200px' }}>
                  {order.status === 'PENDING' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <ConfirmOrderBtn orderId={order.id} />
                      <CancelOrderBtn orderId={order.id} />
                    </div>
                  ) : order.status === 'CANCELLED' ? (
                     <div style={{ display: 'flex', justifyContent: 'center' }}>
                       <TrashOrderBtn orderId={order.id} />
                     </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#34d399' }}>تم التوزيع ✅</span>
                      <CancelOrderBtn orderId={order.id} />
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
