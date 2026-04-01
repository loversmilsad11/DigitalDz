'use client';
// Coupons management component
import { useState, useTransition } from 'react';
import { createCoupon, toggleCoupon, deleteCoupon } from '@/lib/user-actions';
import { Plus, Trash2, ToggleLeft, ToggleRight, Tag, Percent, DollarSign } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  discount: any;
  type: string;
  maxUses: number | null;
  usedCount: number;
  expiresAt: Date | null;
  isActive: boolean;
  createdAt: Date;
}

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '0.875rem', padding: '0.7rem 1rem', color: 'white', fontSize: '0.9rem', outline: 'none',
};

export default function CouponsManager({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');
  const [showForm, setShowForm] = useState(false);

  const showMsg = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createCoupon(fd);
      if (res.error) { showMsg('❌ ' + res.error); return; }
      // refetch by just adding the returned coupon
      window.location.reload();
    });
  };

  const handleToggle = (id: string, isActive: boolean) => {
    startTransition(async () => {
      await toggleCoupon(id, !isActive);
      setCoupons(c => c.map(cp => cp.id === id ? { ...cp, isActive: !isActive } : cp));
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('حذف هذا الكوبون؟')) return;
    startTransition(async () => {
      await deleteCoupon(id);
      setCoupons(c => c.filter(cp => cp.id !== id));
      showMsg('✓ تم الحذف');
    });
  };

  return (
    <>
      {msg && (
        <div style={{ padding: '0.75rem 1.25rem', borderRadius: '1rem', marginBottom: '1.5rem', fontWeight: 700, fontSize: '0.88rem',
          background: msg.startsWith('✓') ? 'rgba(34,197,94,0.12)' : 'rgba(244,63,94,0.12)',
          border: `1px solid ${msg.startsWith('✓') ? 'rgba(34,197,94,0.3)' : 'rgba(244,63,94,0.3)'}`,
          color: msg.startsWith('✓') ? '#22c55e' : '#f43f5e' }}>
          {msg}
        </div>
      )}

      {/* Add Button */}
      <button onClick={() => setShowForm(v => !v)} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '1.1rem', marginBottom: '2rem', fontWeight: 700, fontSize: '0.9rem' }}>
        <Plus size={18}/> {showForm ? 'إلغاء' : 'إنشاء كوبون'}
      </button>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} style={{ padding: '1.5rem', borderRadius: '1.5rem', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--foreground-muted)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>الكود *</label>
            <input name="code" required placeholder="EX: SAVE20" style={inputStyle}/>
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--foreground-muted)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>الخصم *</label>
            <input name="discount" type="number" required min={1} placeholder="20" style={inputStyle}/>
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--foreground-muted)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>النوع</label>
            <select name="type" style={{ ...inputStyle, background: 'rgba(255,255,255,0.06)' }}>
              <option value="PERCENT">نسبة مئوية %</option>
              <option value="FIXED">مبلغ ثابت د.ج</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--foreground-muted)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>أقصى استخدام</label>
            <input name="maxUses" type="number" min={1} placeholder="100" style={inputStyle}/>
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--foreground-muted)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>تنتهي في</label>
            <input name="expiresAt" type="date" style={inputStyle}/>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" disabled={isPending} style={{ width: '100%', padding: '0.7rem', borderRadius: '0.875rem', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}>
              {isPending ? '...' : 'حفظ'}
            </button>
          </div>
        </form>
      )}

      {/* Coupons Table */}
      {coupons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--foreground-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '1.5rem', border: '1px dashed rgba(255,255,255,0.08)' }}>
          <Tag size={40} style={{ opacity: 0.2, marginBottom: '0.75rem' }}/><br/>لا توجد كوبونات بعد
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {coupons.map(c => (
            <div key={c.id} className="glass-morphism" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', opacity: c.isActive ? 1 : 0.5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                {c.type === 'PERCENT' ? <Percent size={16} style={{ color: '#fbbf24' }}/> : <DollarSign size={16} style={{ color: '#34d399' }}/>}
                <code style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.05rem', color: 'white', letterSpacing: 1 }}>{c.code}</code>
              </div>
              <div style={{ color: '#fbbf24', fontWeight: 800 }}>
                {Number(c.discount)}{c.type === 'PERCENT' ? '%' : ' د.ج'}
              </div>
              <div style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem' }}>
                {c.usedCount}/{c.maxUses ?? '∞'} استخدام
              </div>
              {c.expiresAt && (
                <div style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem' }}>
                  حتى {new Date(c.expiresAt).toLocaleDateString('ar-DZ')}
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button onClick={() => handleToggle(c.id, c.isActive)} disabled={isPending} title={c.isActive ? 'تعطيل' : 'تفعيل'} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: c.isActive ? '#22c55e' : 'var(--foreground-muted)', transition: 'color 0.2s' }}>
                  {c.isActive ? <ToggleRight size={26}/> : <ToggleLeft size={26}/>}
                </button>
                <button onClick={() => handleDelete(c.id)} disabled={isPending} title="حذف" style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '0.6rem', padding: '0.35rem 0.6rem', color: '#f43f5e', cursor: 'pointer' }}>
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
