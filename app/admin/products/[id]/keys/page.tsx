import { getProductKeys } from '@/lib/admin-actions';
import prisma from '@/lib/db';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';
import KeysManagerClient from './KeysManagerClient';

export default async function ProductKeysPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const id = p.id;
  
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) return <div style={{ padding: '4rem', textAlign: 'center' }}>المنتج غير موجود</div>;

  const keys = await getProductKeys(id);
  const availableKeys = keys.filter(k => k.status === 'AVAILABLE');
  const soldKeys = keys.filter(k => k.status === 'SOLD');

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <Link 
          href="/admin/products"
          style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowRight size={20} />
        </Link>
        <div>
          <h1 className="title-font gradient-text" style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.2rem' }}>مخزون المفاتيح</h1>
          <p style={{ color: 'var(--foreground-muted)' }}>{product.nameAr}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-morphism" style={{ padding: '1.5rem', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(52, 211, 153, 0.2)', backgroundColor: 'rgba(52, 211, 153, 0.05)' }}>
          <div style={{ padding: '1rem', borderRadius: '1rem', backgroundColor: 'rgba(52, 211, 153, 0.1)' }}>
            <ShieldCheck size={24} color="#34d399" />
          </div>
          <div>
            <div style={{ color: 'var(--foreground-muted)', fontSize: '0.85rem' }}>المفاتيح المتاحة للبيع</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>{availableKeys.length}</div>
          </div>
        </div>

        <div className="glass-morphism" style={{ padding: '1.5rem', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(96, 165, 250, 0.2)', backgroundColor: 'rgba(96, 165, 250, 0.05)' }}>
          <div style={{ padding: '1rem', borderRadius: '1rem', backgroundColor: 'rgba(96, 165, 250, 0.1)' }}>
            <ShoppingCart size={24} color="#60a5fa" />
          </div>
          <div>
            <div style={{ color: 'var(--foreground-muted)', fontSize: '0.85rem' }}>المفاتيح المباعة</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>{soldKeys.length}</div>
          </div>
        </div>
      </div>

      <KeysManagerClient productId={id} keys={keys} />
    </div>
  );
}
