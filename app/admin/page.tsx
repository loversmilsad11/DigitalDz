import { getCategories, getProducts, getDashboardStats } from '@/lib/admin-actions';
import { getEnhancedStats } from '@/lib/user-actions';
import { Package, Tag, Users, ShoppingCart, TrendingUp, DollarSign, Award } from 'lucide-react';
import AdminChart from '@/components/AdminChart';

export default async function AdminDashboardOverview() {
  const categories = await getCategories();
  const products = await getProducts();
  const { totalOrders, totalUsers, recentOrders, chartData } = await getDashboardStats();
  const { totalRevenue, topProducts, recentUsersCount } = await getEnhancedStats();

  const stats = [
    { label: 'إجمالي المنتجات', value: products.length, icon: Package, color: '#e879f9' },
    { label: 'إجمالي الفئات', value: categories.length, icon: Tag, color: '#34d399' },
    { label: 'إجمالي الطلبات', value: totalOrders, icon: ShoppingCart, color: '#fbbf24' },
    { label: 'إجمالي الإيرادات', value: `${totalRevenue.toLocaleString()} د.ج`, icon: DollarSign, color: '#34d399' },
  ];

  return (
    <div className="fade-in">
      <h1 className="title-font gradient-text" style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '2.5rem' }}>لوحة الإدارة</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-morphism" style={{ padding: '1.75rem', borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '1.25rem', border: '1px solid var(--glass-border)' }}>
            <div style={{ padding: '1.25rem', borderRadius: '1.25rem', backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <stat.icon size={28} style={{ color: stat.color }} />
            </div>
            <div>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, color: 'white' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr min(450px, 100%)', gap: '2rem', alignItems: 'start', marginBottom: '3rem' }}>
        {/* Top Selling Products */}
        <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '2.5rem', border: '1px solid var(--glass-border)' }}>
          <h2 className="title-font" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Award size={24} style={{ color: '#fbbf24' }} /> أفضل المنتجات مبيعاً
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topProducts.length === 0 ? (
              <p style={{ color: 'var(--foreground-muted)' }}>لا توجد بيانات كافية.</p>
            ) : (
              topProducts.map((tp: any, i) => (
                <div key={tp.productId} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '0.75rem', overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.05)' }}>
                     {tp.product?.image ? <img src={tp.product.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={20} style={{ margin: '10px', opacity: 0.3 }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tp.product?.nameAr || 'منتج محذوف'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>تم بيع {tp._sum.quantity} قطعة</div>
                  </div>
                  <div style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '0.9rem' }}>#{i+1}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '2.5rem', border: '1px solid var(--glass-border)' }}>
          <h2 className="title-font" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <TrendingUp size={24} style={{ color: '#60a5fa' }} /> مبيعات آخر 30 يوماً
          </h2>
          <AdminChart data={chartData} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '100%', gap: '2rem', alignItems: 'start' }}>
        {/* Recent Orders Table */}
        <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '2.5rem', border: '1px solid var(--glass-border)' }}>
          <h2 className="title-font" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'white' }}>أحدث الطلبات</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentOrders.length === 0 ? (
              <p style={{ color: 'var(--foreground-muted)' }}>لا توجد طلبات حديثة.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'white', marginBottom: '0.2rem' }}>{order.customerName || order.user.name || 'عميل'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>{order.paymentMethod} • {new Date(order.createdAt).toLocaleDateString('ar-DZ')}</div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 900, color: '#34d399' }}>{Number(order.total).toLocaleString()} د.ج</div>
                    <div style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '1rem', backgroundColor: order.status === 'PENDING' ? '#f59e0b20' : '#34d39920', color: order.status === 'PENDING' ? '#f59e0b' : '#34d399', display: 'inline-block', marginTop: '0.3rem' }}>
                      {order.status === 'PENDING' ? 'قيد المراجعة' : 'مكتمل'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
