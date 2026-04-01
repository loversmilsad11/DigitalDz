import { getUsers } from '@/lib/user-actions';
import UsersTable from '@/components/UsersTable';
import { Users, Crown, UserCheck } from 'lucide-react';

export default async function AdminUsersPage() {
  const users = await getUsers();

  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const userCount = users.filter(u => u.role === 'USER').length;
  const activeCount = users.filter(u => u._count.orders > 0).length;

  return (
    <div className="fade-in">
      <h1 className="title-font gradient-text" style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>
        إدارة المستخدمين
      </h1>
      <p style={{ color: 'var(--foreground-muted)', marginBottom: '2.5rem' }}>إجمالي {users.length} مستخدم مسجّل</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'إجمالي المستخدمين', value: users.length, icon: Users, color: '#60a5fa' },
          { label: 'أدمين',             value: adminCount,   icon: Crown, color: '#e879f9' },
          { label: 'عملاء نشطون',       value: activeCount,  icon: UserCheck, color: '#34d399' },
        ].map((stat, i) => (
          <div key={i} className="glass-morphism" style={{ padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.9rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.03)' }}>
              <stat.icon size={22} style={{ color: stat.color }}/>
            </div>
            <div>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem', marginBottom: '0.2rem' }}>{stat.label}</p>
              <p className="title-font" style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white' }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <UsersTable users={users} />
    </div>
  );
}
