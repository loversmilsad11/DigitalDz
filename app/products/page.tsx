import Navbar from '@/components/Navbar';
import prisma from '@/lib/db';
import ProductsFilter from '@/components/ProductsFilter';

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ orderBy: { nameAr: 'asc' }, include: { category: true } }),
    prisma.category.findMany({ orderBy: { nameAr: 'asc' } }),
  ]);

  const serialized = products.map(p => ({
    id: p.id,
    nameAr: p.nameAr,
    nameFr: p.nameFr,
    descriptionAr: p.descriptionAr,
    price: Number(p.price),
    slug: p.slug,
    image: p.image,
    category: p.category,
  }));

  return (
    <div className="fade-in">
      <Navbar />
      <div className="container" style={{ padding: '4rem 0' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 className="title-font gradient-text" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.75rem' }}>
            الألعاب و البرامج
          </h1>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '1.1rem' }}>
            تصفح مجموعتنا الواسعة من المفاتيح الرقمية بكل سهولة.
          </p>
        </div>
        <ProductsFilter products={serialized} categories={categories} />
      </div>
    </div>
  );
}

