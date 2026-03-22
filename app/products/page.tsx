import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import prisma from '@/lib/db';

export default async function ProductsPage() {
  // Fetch all products from the database
  const products = await prisma.product.findMany({
    orderBy: { nameAr: 'asc' },
    include: { category: true }
  });

  return (
    <div className="fade-in">
      <Navbar />
      <div className="container" style={{ padding: '4rem 0' }}>
        <div style={{ marginBottom: '4rem' }}>
          <h1 className="title-font gradient-text" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>
            الألعاب و البرامج
          </h1>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '1.1rem' }}>تصفح مجموعتنا الواسعة من المفاتيح الرقمية بكل سهولة.</p>
        </div>

        {/* Categories Filter (Visual only for now) */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', overflowX: 'auto', paddingBottom: '1rem' }}>
           <button className="btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '1rem' }}>الكل</button>
           <button className="glass-morphism" style={{ padding: '0.6rem 1.5rem', borderRadius: '1rem', color: '#fff' }}>الألعاب</button>
           <button className="glass-morphism" style={{ padding: '0.6rem 1.5rem', borderRadius: '1rem', color: '#fff' }}>البرامج</button>
           <button className="glass-morphism" style={{ padding: '0.6rem 1.5rem', borderRadius: '1rem', color: '#fff' }}>الاشتراكات</button>
        </div>

        {products.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--foreground-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '2rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
            لا توجد منتجات متوفرة حالياً.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {products.map((p) => (
              <ProductCard 
                key={p.id}
                id={p.id}
                name={p.nameAr}
                description={p.descriptionAr}
                price={Number(p.price)}
                slug={p.slug}
                image={p.image || undefined}
                currency="د.ج"
                addToCartLabel="أضف إلى السلة"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
