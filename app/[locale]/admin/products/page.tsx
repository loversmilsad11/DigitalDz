'use client';
import { use, useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '@/lib/admin-actions';
import { Package, Trash2, Plus, Loader2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function ProductsAdminPage(props: { params: Promise<{ locale: string }> }) {
  const params = use(props.params);
  const t = useTranslations('Admin');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isRtl = params.locale === 'ar';

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm(t('confirmDelete'))) return;
    setLoading(true);
    await deleteProduct(id);
    await fetchProducts();
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="title-font" style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Package style={{ color: '#e879f9' }} /> {t('products')}
        </h1>
        <Link 
          href={`/${params.locale}/admin/products/new`}
          style={{ backgroundColor: '#c026d3', color: 'white', fontWeight: 'bold', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', transition: 'background-color 0.2s' }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#a21caf'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#c026d3'}
        >
          <Plus size={20} /> {t('addNewProduct')}
        </Link>
      </div>

      <div className="glass-morphism" style={{ borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
        {loading ? (
          <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Loader2 className="animate-spin" size={40} style={{ color: '#e879f9' }} />
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--foreground-muted)' }}>
            {t('noProducts')}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: isRtl ? 'right' : 'left', borderCollapse: 'collapse' }} dir={isRtl ? 'rtl' : 'ltr'}>
              <thead style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                <tr>
                  <th style={{ padding: '1.25rem 1rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>{t('image')}</th>
                  <th style={{ padding: '1.25rem 1rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>{params.locale === 'ar' ? 'اسم المنتج' : 'Nom du Produit'}</th>
                  <th style={{ padding: '1.25rem 1rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>{t('category')}</th>
                  <th style={{ padding: '1.25rem 1rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>{t('price')}</th>
                  <th style={{ padding: '1.25rem 1rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '1rem' }}>
                      {prod.image ? (
                        <img src={prod.image} alt={prod.nameAr} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.75rem', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                      ) : (
                        <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.75rem', backgroundColor: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground-muted)' }}>
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'white' }}>
                      {params.locale === 'ar' ? prod.nameAr : prod.nameFr}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', padding: '0.35rem 0.85rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                        {params.locale === 'ar' ? (prod.category?.nameAr || 'غير محدد') : (prod.category?.nameFr || 'Inconnu')}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#e879f9', fontWeight: 900, fontSize: '1.1rem' }}>
                      {prod.price.toString()} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>د.ج</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        onClick={() => handleDelete(prod.id)} 
                        style={{ padding: '0.6rem', color: '#fb7185', background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.1)', borderRadius: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseOver={e => {
                          e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.2)';
                          e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.3)';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.05)';
                          e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.1)';
                        }}
                        title={t('delete')}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
