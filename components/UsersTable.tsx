'use client';
import { useState, useTransition } from 'react';
import { updateUserRole } from '@/lib/user-actions';
import { Shield, User, ShoppingBag, Mail } from 'lucide-react';

interface UserItem {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  image: string | null;
  _count: { orders: number };
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span style={{
      padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 800,
      background: role === 'ADMIN' ? 'rgba(232,121,249,0.15)' : 'rgba(99,102,241,0.1)',
      color: role === 'ADMIN' ? '#e879f9' : 'var(--primary)',
      border: `1px solid ${role === 'ADMIN' ? 'rgba(232,121,249,0.25)' : 'rgba(99,102,241,0.2)'}`,
    }}>
      {role === 'ADMIN' ? '👑 أدمين' : '👤 مستخدم'}
    </span>
  );
}

export default function UsersTable({ users }: { users: UserItem[] }) {
  const [list, setList] = useState(users);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');

  const toggleRole = (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    startTransition(async () => {
      const res = await updateUserRole(userId, newRole);
      if (res.error) { setMsg(res.error); return; }
      setList(l => l.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setMsg('تم تحديث الدور بنجاح ✓');
      setTimeout(() => setMsg(''), 3000);
    });
  };

  return (
    <>
      {msg && (
        <div style={{ padding: '0.75rem 1.25rem', borderRadius: '1rem', background: msg.includes('✓') ? 'rgba(34,197,94,0.12)' : 'rgba(244,63,94,0.12)', border: `1px solid ${msg.includes('✓') ? 'rgba(34,197,94,0.3)' : 'rgba(244,63,94,0.3)'}`, color: msg.includes('✓') ? '#22c55e' : '#f43f5e', marginBottom: '1.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {list.map(user => (
          <div key={user.id} className="glass-morphism" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem 1.5rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {user.image
                ? <img src={user.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                : <User size={20} style={{ color: 'var(--primary)' }}/>}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{user.name || 'بدون اسم'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--foreground-muted)', fontSize: '0.8rem' }}>
                <Mail size={12}/> {user.email}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--foreground-muted)', fontSize: '0.82rem' }}>
              <ShoppingBag size={14}/> {user._count.orders} طلب
            </div>

            {/* Role */}
            <RoleBadge role={user.role} />

            {/* Toggle */}
            <button
              onClick={() => toggleRole(user.id, user.role)}
              disabled={isPending}
              style={{ padding: '0.45rem 1rem', borderRadius: '0.75rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                background: user.role === 'ADMIN' ? 'rgba(244,63,94,0.1)' : 'rgba(99,102,241,0.12)',
                border: `1px solid ${user.role === 'ADMIN' ? 'rgba(244,63,94,0.25)' : 'rgba(99,102,241,0.25)'}`,
                color: user.role === 'ADMIN' ? '#f43f5e' : 'var(--primary)',
                opacity: isPending ? 0.6 : 1,
              }}
            >
              {user.role === 'ADMIN' ? 'إلغاء الأدمين' : 'ترقية لأدمين'}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
