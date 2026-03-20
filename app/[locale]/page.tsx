import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';

export default async function IndexPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const { locale } = params;

  console.log(`[IndexPage] locale: "${locale}"`);

  const t = await getTranslations('Index');
  const nt = await getTranslations('Navbar');
  const ct = await getTranslations('Common');

  const mockProducts = [
    { id: '1', nameAr: 'بطاقة ستيم 10 دولار', nameFr: 'Carte Steam 10$', price: 2500, slug: 'steam-10' },
    { id: '2', nameAr: 'نتفليكس شهر بريميوم', nameFr: 'Netflix 1 Mois Premium', price: 1200, slug: 'netflix-1' },
    { id: '3', nameAr: 'بلايستيشن بلس سنة', nameFr: 'PS Plus 12 Mois', price: 9500, slug: 'ps-plus' },
    { id: '4', nameAr: 'فري فاير 100 جوهرة', nameFr: 'Free Fire 100 Diamants', price: 350, slug: 'ff-100' },
  ];

  return (
    <div className="fade-in">
      <Navbar />

      {/* Hero Section */}
      <section className="container" style={{ 
        padding: '8rem 2rem', 
        position: 'relative', 
        overflow: 'hidden', 
        borderRadius: '3rem',
        background: 'linear-gradient(rgba(10, 10, 12, 0.7), rgba(10, 10, 12, 0.9)), url("/hero.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        marginTop: '2rem',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div className="glow" style={{ top: -100, left: -100, background: 'rgba(99, 102, 241, 0.4)' }} />
        
        <div style={{ maxWidth: 900, position: 'relative', zIndex: 1 }}>
          <span className="glass-morphism" style={{ 
            padding: '0.6rem 1.5rem', 
            borderRadius: '2.5rem', 
            fontSize: '0.9rem', 
            color: 'var(--primary)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '2.5rem',
            display: 'inline-block',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--primary)'
          }}>
            أفضل الأسعار في الجزائر 🇩🇿 Meilleur Prix en Algérie
          </span>
          <h1 className="title-font gradient-text" style={{ fontSize: 'clamp(2.5rem, 9vw, 5.5rem)', marginBottom: '1.5rem', lineHeight: 1, fontWeight: 900 }}>
            {t('title')}
          </h1>
          <p style={{ fontSize: '1.4rem', color: '#cbd5e1', marginBottom: '3.5rem', maxWidth: 700, margin: '0 auto 3.5rem', lineHeight: 1.6 }}>
            {t('description')}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/products" className="btn-primary" style={{ fontSize: '1.2rem', padding: '1.3rem 3rem', borderRadius: '1.5rem', textDecoration: 'none' }}>
              {t('cta')}
            </Link>
            <Link href="/about" className="glass-morphism" style={{ padding: '1.3rem 3rem', borderRadius: '1.5rem', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '1.2rem' }}>
              {nt('contact')}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container" style={{ padding: '4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
          <div>
             <h2 className="title-font" style={{ fontSize: '2.5rem', fontWeight: 800 }}>{nt('products')}</h2>
             <p style={{ color: 'var(--foreground-muted)' }}>استكشف أحدث المنتجات الرقمية المتوفرة</p>
          </div>
          <Link href="/products" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem' }}>
            {t('cta')} &rarr;
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem' }}>
          {mockProducts.map((p) => (
            <ProductCard 
              key={p.id}
              id={p.id}
              name={p.nameAr} // Should use locale later
              description="تسليم فوري ومضمون 100% لجميع عملائنا في الجزائر."
              price={p.price}
              slug={p.slug}
              currency={ct('currency')}
              addToCartLabel={ct('addToCart')}
            />
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container" style={{ padding: '4rem 0', borderTop: '1px solid var(--glass-border)', marginTop: '4rem' }}>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'center' }}>
            <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '2rem' }}>
               <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
               <h3 className="title-font">تسليم سريع</h3>
               <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>استلم مفتاحك الرقمي فوراً بعد تأكيد الدفع</p>
            </div>
            <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '2rem' }}>
               <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛡️</div>
               <h3 className="title-font">دفع آمن</h3>
               <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>طرق دفع متعددة: Baridimob, CCP, البطاقة الذهبية</p>
            </div>
            <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '2rem' }}>
               <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📞</div>
               <h3 className="title-font">دعم فني</h3>
               <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>فريق متخصص للرد على استفساراتكم على مدار الساعة</p>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="container" style={{ padding: '6rem 0', marginTop: '4rem', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', justifyContent: 'space-between' }}>
          <div style={{ maxWidth: 300 }}>
            <h2 className="title-font gradient-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>DigitalDZ</h2>
            <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.6 }}>
               المنصة الأولى لبيع المنتجات الرقمية في الجزائر بجودة عالمية وأسعار تنافسية.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '6rem' }}>
            <div>
               <h4 className="title-font" style={{ marginBottom: '1.5rem' }}>روابط سريعة</h4>
               <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <li><Link href="/" style={{ color: 'var(--foreground-muted)', textDecoration: 'none' }}>الرئيسية</Link></li>
                  <li><Link href="/products" style={{ color: 'var(--foreground-muted)', textDecoration: 'none' }}>المنتجات</Link></li>
                  <li><Link href="/faq" style={{ color: 'var(--foreground-muted)', textDecoration: 'none' }}>الأسئلة الشائعة</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="title-font" style={{ marginBottom: '1.5rem' }}>اللغة / Langue</h4>
               <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <li><Link href="/ar" style={{ color: 'var(--foreground-muted)', textDecoration: 'none' }}>العربية (Algérie)</Link></li>
                  <li><Link href="/fr" style={{ color: 'var(--foreground-muted)', textDecoration: 'none' }}>Français (Algérie)</Link></li>
               </ul>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--glass-border)', fontSize: '0.9rem' }}>
          &copy; 2026 DigitalDZ. Made with ❤️ in Algeria.
        </div>
      </footer>
    </div>
  );
}
