import { getCategories, getProducts } from '@/lib/admin-actions';
import { Package, Tag, Users, ShoppingCart } from 'lucide-react';

export default async function AdminDashboardOverview() {
  const categories = await getCategories();
  const products = await getProducts();

  const stats = [
    { label: 'إجمالي المنتجات', value: products.length, icon: Package, color: 'text-fuchsia-400' },
    { label: 'إجمالي التصنيفات', value: categories.length, icon: Tag, color: 'text-emerald-400' },
    { label: 'الطلبات (قريباً)', value: 0, icon: ShoppingCart, color: 'text-amber-400' },
    { label: 'المستخدمين (قريباً)', value: 0, icon: Users, color: 'text-blue-400' },
  ];

  return (
    <div>
      <h1 className="title-font gradient-text" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>نظرة عامة</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-morphism" style={{ padding: '1.5rem', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: '1rem', backgroundColor: 'rgba(255,255,255,0.05)' }} className={stat.color}>
              <stat.icon size={24} style={{ color: stat.color === 'text-fuchsia-400' ? '#e879f9' : stat.color === 'text-emerald-400' ? '#34d399' : stat.color === 'text-amber-400' ? '#fbbf24' : '#60a5fa' }} />
            </div>
            <div>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
      
      <div className="glass-morphism" style={{ marginTop: '3rem', padding: '2rem', borderRadius: '2rem' }}>
        <h2 className="title-font" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>مرحباً بك في لوحة الإدارة!</h2>
        <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.6 }}>
          من هنا يمكنك التحكم الكامل في منتجات وتصنيفات متجرك الرقمي. 
          استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة. 
          جميع العمليات هنا تتم بشكل فوري وآمن وتتطلب صلاحية المدير (ADMIN).
        </p>
      </div>
    </div>
  );
}
