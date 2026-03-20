import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

export default async function ProductDetailsPage(props: { params: Promise<{ locale: string, slug: string }> }) {
  const params = await props.params;
  const { locale, slug } = params;
  
  const t = await getTranslations('Product');
  const ct = await getTranslations('Common');

  // Static mock product search by slug
  const products = {
    'steam-10': { nameAr: 'بطاقة ستيم 10 دولار', nameFr: 'Carte Steam 10$', price: 2500, descAr: 'بطاقة هدايا ستيم بقيمة 10 دولار لتعبئة رصيدك في المتجر العالمي.', descFr: 'Carte cadeau Steam de 10$ pour recharger votre compte sur le magasin mondial.' },
    'netflix-1': { nameAr: 'نتفليكس شهر بريميوم', nameFr: 'Netflix 1 Mois Premium', price: 1200, descAr: 'اشتراك نتفلكس بريميوم لمدة شهر واحد بجودة 4K UHD وتسليم فوري.', descFr: 'Abonnement Netflix Premium de 1 mois en 4K UHD avec livraison instantanée.' },
    'ps-plus': { nameAr: 'بلايستيشن بلس سنة', nameFr: 'PS Plus 12 Mois', price: 9500, descAr: 'عضوية بلايستيشن بلس لمدة 12 شهر للاستمتاع بألعاب الأونلاين.', descFr: 'Abonnement PlayStation Plus de 12 mois pour profiter des jeux en ligne.' },
  };

  const product = (products as any)[slug] || products['steam-10'];
  const name = locale === 'ar' ? product.nameAr : product.nameFr;
  const description = locale === 'ar' ? product.descAr : product.descFr;

  return (
    <div className="fade-in min-h-screen">
      <Navbar />
      
      <main className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image/Visual */}
          <div className="glass-morphism rounded-3xl p-8 flex items-center justify-center min-h-[400px]" 
               style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #121212 100%)', border: '1px solid var(--glass-border)' }}>
             <div style={{ fontSize: '5rem', opacity: 0.5 }}>💳</div>
             <div className="glow" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px' }} />
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <span className="text-primary font-bold tracking-widest text-sm uppercase mb-2 block">{t('available')}</span>
              <h1 className="title-font text-5xl font-black mb-4 gradient-text">{name}</h1>
              <p className="text-xl text-foreground-muted leading-relaxed">
                {description}
              </p>
            </div>

            <div className="glass-morphism p-6 rounded-2xl flex items-center justify-between border-none">
               <span className="text-foreground-muted">{t('price')}</span>
               <span className="text-4xl font-black">{product.price.toLocaleString()} <span className="text-lg font-medium text-foreground-muted">{ct('currency')}</span></span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
               <button className="btn-primary py-4 text-xl font-bold" style={{ borderRadius: '1.2rem' }}>
                 {t('buyNow')}
               </button>
               <button className="glass-morphism py-4 text-lg font-bold" style={{ borderRadius: '1.2rem', color: '#fff', border: '2px solid var(--glass-border)' }}>
                 {ct('addToCart')}
               </button>
            </div>

            <div className="pt-8 space-y-4">
               <h3 className="title-font text-xl font-bold">لماذا تشتري من DigitalDZ؟</h3>
               <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none text-foreground-muted">
                  <li className="flex items-center gap-2">✅ تسليم تلقائي ومباشر</li>
                  <li className="flex items-center gap-2">✅ ضمان 100% على المفاتيح</li>
                  <li className="flex items-center gap-2">✅ دعم فني جزائري 24/7</li>
                  <li className="flex items-center gap-2">✅ طرق دفع سهلة (Baridimob)</li>
               </ul>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <section className="mt-20">
           <h2 className="title-font text-3xl font-bold mb-8">{t('relatedProducts')}</h2>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 opacity-60 pointer-events-none">
              <div className="glass-morphism p-6 rounded-2xl h-40">Coming Soon...</div>
              <div className="glass-morphism p-6 rounded-2xl h-40">Coming Soon...</div>
              <div className="glass-morphism p-6 rounded-2xl h-40">Coming Soon...</div>
           </div>
        </section>
      </main>
    </div>
  );
}
