import { getOrders } from '@/lib/admin-actions';
import OrdersTableClient from '@/components/OrdersTableClient';

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  // Sort orders so PENDING comes first, then by date descending
  const sortedOrders = [...orders].sort((a, b) => {
    if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
    if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="title-font gradient-text" style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>الطلبات والمراجعة</h1>
          <p style={{ color: 'var(--foreground-muted)' }}>قم بمراجعة، تأكيد، التعليق المتعدد، والحذف للطلبات الخاصة بمتجرك</p>
        </div>
      </div>

      <OrdersTableClient initialOrders={sortedOrders} />
    </div>
  );
}
