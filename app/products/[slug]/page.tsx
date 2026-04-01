import Navbar from '@/components/Navbar';
import prisma from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';
import ProductCard from '@/components/ProductCard';
import ProductReviews from '@/components/ProductReviews';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/Animations';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: 'منتج – DigitalDZ' };
  return {
    title: `${product.nameAr} – DigitalDZ`,
    description: product.descriptionAr,
    openGraph: { title: product.nameAr, description: product.descriptionAr, images: product.image ? [product.image] : [] },
  };
}

export default async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;

  let product = null;
  let relatedProducts: any[] = [];
  let reviews: any[] = [];
  let hasBought = false;

  const session = await getServerSession(authOptions);

  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (product) {
      [relatedProducts, reviews] = await Promise.all([
        prisma.product.findMany({
          where: {
            categoryId: product.categoryId,
            NOT: { id: product.id },
          },
          take: 3,
        }),
        prisma.review.findMany({
          where: { productId: product.id },
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
        })
      ]);

      if (session?.user) {
        const orderCount = await prisma.orderItem.count({
          where: {
            productId: product.id,
            order: {
              userId: (session.user as any).id,
              status: { in: ['COMPLETED', 'PAID'] }
            }
          }
        });
        hasBought = orderCount > 0;
      }
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
  }

  if (!product) {
    product = {
      id: `mock-${slug}`,
      slug: slug,
      image: null,
      nameAr: decodeURIComponent(slug).replace(/-/g, ' '),
      price: 1500,
      descriptionAr: 'هذا وصف افتراضي للمنتج لأن قاعدة البيانات غير متصلة مؤقتاً.',
      category: { nameAr: 'منتجات رقمية', slug: 'digital' }
    };
  }

  return (
    <div className="fade-in">
      <Navbar />

      <div className="container" style={{ padding: '2rem 2rem 6rem' }}>
        <ProductDetailClient
          product={{
            id: product.id,
            slug: product.slug,
            name: product.nameAr,
            description: product.descriptionAr,
            price: Number(product.price),
            image: product.image ?? undefined,
            categoryName: product.category?.nameAr ?? '',
          }}
          currency="د.ج"
          labels={{
            available: "متوفر",
            addToCart: "أضف إلى السلة",
            buyNow: "اشتري الآن",
            priceLabel: "السعر",
            whyBuy: 'لماذا تشتري من DigitalDZ؟',
            instantDelivery: 'تسليم فوري بعد الدفع',
            guarantee: 'ضمان 100% على المفاتيح',
            support: 'دعم جزائري 24/7',
            algerianPayments: 'دفع بـ Baridimob / CCP / CIB',
            quantity: 'الكمية',
            addedToCart: 'أُضيف إلى السلة ✓',
            viewCart: 'عرض السلة',
            category: 'الفئة',
            home: 'الرئيسية',
            products: 'المنتجات',
          }}
        />

        <ProductReviews
          productId={product.id}
          initialReviews={reviews.map(r => ({
             ...r,
             createdAt: r.createdAt
          }))}
          isLoggedIn={!!session}
          hasBought={hasBought}
        />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <FadeIn>
              <h2 className="title-font" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2.5rem' }}>
                منتجات مشابهة
              </h2>
            </FadeIn>
            <StaggerContainer>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
                {relatedProducts.map((p) => (
                  <StaggerItem key={p.id}>
                    <ProductCard
                      id={p.id}
                      name={p.nameAr}
                      description={p.descriptionAr}
                      price={Number(p.price)}
                      slug={p.slug}
                      image={p.image ?? undefined}
                      currency="د.ج"
                      addToCartLabel="أضف إلى السلة"
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

