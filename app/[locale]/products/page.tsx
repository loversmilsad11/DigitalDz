import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';

export default async function ProductsPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const t = await getTranslations('Index');
  const ct = await getTranslations('Common');
  const catT = await getTranslations('Categories');

  const allProducts = [
    { id: '1', nameAr: 'بطاقة ستيم 10 دولار', nameFr: 'Carte Steam 10$', price: 2500, slug: 'steam-10', category: 'gaming' },
    { id: '2', nameAr: 'نتفليكس شهر بريميوم', nameFr: 'Netflix 1 Mois Premium', price: 1200, slug: 'netflix-1', category: 'subscriptions' },
    { id: '3', nameAr: 'بلايستيشن بلس سنة', nameFr: 'PS Plus 12 Mois', price: 9500, slug: 'ps-plus', category: 'gaming' },
    { id: '4', nameAr: 'فري فاير 100 جوهرة', nameFr: 'Free Fire 100 Diamants', price: 350, slug: 'ff-100', category: 'gaming' },
    { id: '5', nameAr: 'ويندوز 11 برو أصلي', nameFr: 'Windows 11 Pro Original', price: 4500, slug: 'win-11', category: 'software' },
    { id: '6', nameAr: 'أدوبي كريتيف كلاود', nameFr: 'Adobe Creative Cloud', price: 15000, slug: 'adobe-cc', category: 'software' },
  ];

  return (
    <div className="fade-in">
      <Navbar />
      <div className="container" style={{ padding: '4rem 0' }}>
        <div style={{ marginBottom: '4rem' }}>
          <h1 className="title-font gradient-text" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>
            {catT('gaming')} & {catT('software')}
          </h1>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '1.1rem' }}>تصفح مجموعتنا الواسعة من المفاتيح الرقمية بكل سهولة.</p>
        </div>

        {/* Categories Filter (Visual only for now) */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', overflowX: 'auto', paddingBottom: '1rem' }}>
           <button className="btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '1rem' }}>الكل</button>
           <button className="glass-morphism" style={{ padding: '0.6rem 1.5rem', borderRadius: '1rem', color: '#fff' }}>{catT('gaming')}</button>
           <button className="glass-morphism" style={{ padding: '0.6rem 1.5rem', borderRadius: '1rem', color: '#fff' }}>{catT('software')}</button>
           <button className="glass-morphism" style={{ padding: '0.6rem 1.5rem', borderRadius: '1rem', color: '#fff' }}>{catT('subscriptions')}</button>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {allProducts.map((p) => (
            <ProductCard 
              key={p.id}
              id={p.id}
              name={params.locale === 'ar' ? p.nameAr : p.nameFr}
              description="تسليم فوري ومضمون لكافة ولايات الوطن."
              price={p.price}
              slug={p.slug}
              currency={ct('currency')}
              addToCartLabel={ct('addToCart')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
