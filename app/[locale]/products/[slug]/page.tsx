import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import prisma from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';
import ProductCard from '@/components/ProductCard';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/Animations';

export default async function ProductDetailsPage(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const params = await props.params;
  const { locale, slug } = params;

  const t = await getTranslations('Product');
  const ct = await getTranslations('Common');

  let product = null;
  let relatedProducts: any[] = [];

  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (product) {
      relatedProducts = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          NOT: { id: product.id },
        },
        take: 3,
      });
    }
  } catch {
    // DB not available — show fallback below
  }

  if (!product) {
    const mocks: Record<string, any> = {
      'steam-10': {
        id: 'mock-1', slug: 'steam-10', image: null,
        nameAr: 'بطاقة ستيم 10 دولار', nameFr: 'Carte Steam 10$',
        price: 2500,
        descriptionAr: 'بطاقة هدايا ستيم بقيمة 10 دولار لتعبئة رصيدك في المتجر العالمي والاستمتاع بآلاف الألعاب.',
        descriptionFr: 'Carte cadeau Steam de 10$ pour recharger votre compte et profiter de milliers de jeux.',
        category: { nameAr: 'الألعاب', nameFr: 'Jeux', slug: 'gaming' },
      },
    };
    
    // Fallback: If in mocks use it, otherwise generate a placeholder from the slug
    product = mocks[slug] ?? {
      id: `mock-${slug}`,
      slug: slug,
      image: null,
      nameAr: decodeURIComponent(slug).replace(/-/g, ' '),
      nameFr: decodeURIComponent(slug).replace(/-/g, ' '),
      price: 1500,
      descriptionAr: 'هذا وصف افتراضي للمنتج لأن قاعدة البيانات غير متصلة مؤقتاً. يمكنك تجربة إضافة المنتج للسلة واختبار باقي الخصائص.',
      descriptionFr: 'Ceci est une description par défaut car la base de données est temporairement hors ligne. Vous pouvez tester toutes les fonctionnalités.',
      category: { nameAr: 'منتجات رقمية', nameFr: 'Produits numériques', slug: 'digital' }
    };
  }

  const name = locale === 'ar' ? product.nameAr : product.nameFr;
  const description = locale === 'ar' ? product.descriptionAr : product.descriptionFr;
  const categoryName = locale === 'ar' ? product.category?.nameAr : product.category?.nameFr;
  const currency = ct('currency');

  return (
    <div className="fade-in">
      <Navbar />

      <div className="container" style={{ padding: '2rem 2rem 6rem' }}>
        {/* ── All interactive parts delegated to the Client component ── */}
        <ProductDetailClient
          product={{
            id: product.id,
            slug: product.slug,
            name,
            description,
            price: Number(product.price),
            image: product.image ?? undefined,
            categoryName: categoryName ?? '',
          }}
          locale={locale}
          currency={currency}
          labels={{
            available: t('available'),
            addToCart: ct('addToCart'),
            buyNow: t('buyNow'),
            priceLabel: t('price'),
            whyBuy: locale === 'ar' ? 'لماذا تشتري من DigitalDZ؟' : 'Pourquoi acheter chez DigitalDZ ?',
            instantDelivery: locale === 'ar' ? 'تسليم فوري بعد الدفع' : 'Livraison instantanée après paiement',
            guarantee: locale === 'ar' ? 'ضمان 100% على المفاتيح' : 'Garantie 100% sur les clés',
            support: locale === 'ar' ? 'دعم جزائري 24/7' : 'Support algérien 24/7',
            algerianPayments: locale === 'ar' ? 'دفع بـ Baridimob / CCP / CIB' : 'Paiement par Baridimob / CCP / CIB',
            quantity: locale === 'ar' ? 'الكمية' : 'Quantité',
            addedToCart: locale === 'ar' ? 'أُضيف إلى السلة ✓' : 'Ajouté au panier ✓',
            viewCart: locale === 'ar' ? 'عرض السلة' : 'Voir le panier',
            category: locale === 'ar' ? 'الفئة' : 'Catégorie',
            home: locale === 'ar' ? 'الرئيسية' : 'Accueil',
            products: locale === 'ar' ? 'المنتجات' : 'Produits',
          }}
        />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <FadeIn>
              <h2 className="title-font" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2.5rem' }}>
                {t('relatedProducts')}
              </h2>
            </FadeIn>
            <StaggerContainer>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
                {relatedProducts.map((p) => (
                  <StaggerItem key={p.id}>
                    <ProductCard
                      id={p.id}
                      name={locale === 'ar' ? p.nameAr : p.nameFr}
                      description={locale === 'ar' ? p.descriptionAr : p.descriptionFr}
                      price={Number(p.price)}
                      slug={p.slug}
                      image={p.image ?? undefined}
                      currency={currency}
                      addToCartLabel={ct('addToCart')}
                    />
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </section>
        )}
      </div>
    </div>
  );
}
