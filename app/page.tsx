import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import prisma from '@/lib/db';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/Animations';

export default async function IndexPage() {
  // Fetch real products from the database
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { id: 'desc' }
  });

  return (
    <div className="fade-in">
      <Navbar />

      {/* Hero Section */}
      <ScaleIn>
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
            <FadeIn delay={0.2}>
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
            </FadeIn>
            <FadeIn delay={0.4}>
              <h1 className="title-font gradient-text" style={{ fontSize: 'clamp(2.5rem, 9vw, 5.5rem)', marginBottom: '1.5rem', lineHeight: 1, fontWeight: 900 }}>
                متجر المنتجات الرقمية
              </h1>
            </FadeIn>
            <FadeIn delay={0.6}>
              <p style={{ fontSize: '1.4rem', color: '#cbd5e1', marginBottom: '3.5rem', maxWidth: 700, margin: '0 auto 3.5rem', lineHeight: 1.6 }}>
                أفضل المنتجات الرقمية في الجزائر بجودة عالية وأسعار منافسة.
              </p>
            </FadeIn>
            <FadeIn delay={0.8}>
              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/products" className="btn-primary" style={{ fontSize: '1.2rem', padding: '1.3rem 3rem', borderRadius: '1.5rem', textDecoration: 'none' }}>
                  تصفح المنتجات
                </Link>
                <Link href="/contact" className="glass-morphism" style={{ padding: '1.3rem 3rem', borderRadius: '1.5rem', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '1.2rem' }}>
                  اتصل بنا
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </ScaleIn>

      {/* Trust Marquee */}
      <div style={{ 
        width: '100%', 
        overflow: 'hidden', 
        padding: '2rem 0', 
        background: 'rgba(255,255,255,0.01)', 
        borderBlock: '1px solid rgba(255,255,255,0.05)',
        marginTop: '2rem'
      }}>
         <div style={{ 
            display: 'flex', 
            gap: '4rem', 
            whiteSpace: 'nowrap',
            animation: 'marquee 30s linear infinite'
         }}>
            {['STEAM', 'NETFLIX', 'PLAYSTATION', 'XBOX', 'FREE FIRE', 'PUBG', 'ADOBE', 'WINDOWS', 'BARIDIMOB', 'CCP', 'EDAHABIA', 'CIB'].map((item, idx) => (
              <span key={idx} style={{ 
                fontSize: '1.2rem', 
                fontWeight: 900, 
                color: 'rgba(255,255,255,0.15)', 
                letterSpacing: '2px',
                fontFamily: 'var(--font-outfit)',
                textTransform: 'uppercase'
              }}>
                {item}
              </span>
            ))}
            {/* Repeat for seamless loop */}
            {['STEAM', 'NETFLIX', 'PLAYSTATION', 'XBOX', 'FREE FIRE', 'PUBG', 'ADOBE', 'WINDOWS', 'BARIDIMOB', 'CCP', 'EDAHABIA', 'CIB'].map((item, idx) => (
              <span key={`dup-${idx}`} style={{ 
                fontSize: '1.2rem', 
                fontWeight: 900, 
                color: 'rgba(255,255,255,0.15)', 
                letterSpacing: '2px',
                fontFamily: 'var(--font-outfit)',
                textTransform: 'uppercase'
              }}>
                {item}
              </span>
            ))}
         </div>
      </div>

      {/* Featured Products */}
      <section className="container" style={{ padding: '4rem 0' }}>
        <FadeIn>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
            <div>
               <h2 className="title-font" style={{ fontSize: '2.5rem', fontWeight: 800 }}>المنتجات</h2>
               <p style={{ color: 'var(--foreground-muted)' }}>استكشف أحدث المنتجات الرقمية المتوفرة</p>
            </div>
            <Link href="/products" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem' }}>
              تصفح المزيد &rarr;
            </Link>
          </div>
        </FadeIn>

        {products.length === 0 ? (
          <FadeIn>
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--foreground-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '2rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
              لا توجد منتجات متوفرة حالياً.
            </div>
          </FadeIn>
        ) : (
          <StaggerContainer>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem' }}>
              {products.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard 
                    id={p.id}
                    name={p.nameAr}
                    description={p.descriptionAr}
                    price={Number(p.price)}
                    slug={p.slug}
                    image={p.image || undefined}
                    currency="د.ج"
                    addToCartLabel="أضف إلى السلة"
                  />
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        )}
      </section>

      {/* Trust Badges */}
      <section className="container" style={{ padding: '4rem 0', borderTop: '1px solid var(--glass-border)', marginTop: '4rem' }}>
         <StaggerContainer>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'center' }}>
              <StaggerItem>
                <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '2rem', height: '100%' }}>
                   <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
                   <h3 className="title-font">تسليم سريع</h3>
                   <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>استلم مفتاحك الرقمي فوراً بعد تأكيد الدفع</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '2rem', height: '100%' }}>
                   <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛡️</div>
                   <h3 className="title-font">دفع آمن</h3>
                   <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>طرق دفع متعددة: Baridimob, CCP, البطاقة الذهبية</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '2rem', height: '100%' }}>
                   <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📞</div>
                   <h3 className="title-font">دعم فني</h3>
                   <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>فريق متخصص للرد على استفساراتكم على مدار الساعة</p>
                </div>
              </StaggerItem>
           </div>
         </StaggerContainer>
      </section>

      {/* Footer */}
      <FadeIn>
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
                    <li><Link href="/about" style={{ color: 'var(--foreground-muted)', textDecoration: 'none' }}>من نحن</Link></li>
                 </ul>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--glass-border)', fontSize: '0.9rem' }}>
            &copy; 2026 DigitalDZ. جميع الحقوق محفوظة. الجزائر.
          </div>
        </footer>
      </FadeIn>
    </div>
  );
}
