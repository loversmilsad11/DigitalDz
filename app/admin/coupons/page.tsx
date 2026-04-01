import { getCoupons } from '@/lib/user-actions';
import CouponsManager from '@/components/CouponsManager';

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();
  return (
    <div className="fade-in">
      <h1 className="title-font gradient-text" style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>
        إدارة الكوبونات
      </h1>
      <p style={{ color: 'var(--foreground-muted)', marginBottom: '2.5rem' }}>
        أنشئ وأدر كوبونات الخصم للعملاء
      </p>
      <CouponsManager initialCoupons={coupons} />
    </div>
  );
}
