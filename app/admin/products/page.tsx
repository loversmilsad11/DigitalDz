'use client';
import { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '@/lib/admin-actions';
import { Package, Trash2, Plus, Loader2, Image as ImageIcon, Key, PencilLine, Tag } from 'lucide-react';
import Link from 'next/link';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟ (سيتم حذفه بكل تفاصيله ومفاتيحه المخزنة)')) return;
    setLoading(true);
    await deleteProduct(id);
    await fetchProducts();
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="title-font gradient-text" style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Package style={{ color: '#e879f9' }} size={36} /> الكتالوج والمنتجات
          </h1>
          <p style={{ color: 'var(--foreground-muted)' }}>أضف منتجات جديدة، عدلها، أو قم بشحن مخزونك بالسيريالات</p>
        </div>
        <Link 
          href="/admin/products/new"
          style={{ backgroundColor: '#c026d3', color: 'white', fontWeight: 'bold', padding: '1rem 1.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(192, 38, 211, 0.4)' }}
        >
          <Plus size={20} /> إضافة منتج جديد
        </Link>
      </div>

      {/* Table Section */}
      <div className="glass-morphism" style={{ borderRadius: '2rem', padding: '1.5rem', overflowX: 'auto', border: '1px solid var(--glass-border)' }}>
        {loading ? (
          <div style={{ padding: '6rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Loader2 className="animate-spin" size={48} style={{ color: '#e879f9' }} />
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: '6rem', textAlign: 'center' }}>
            <Package size={64} style={{ color: 'var(--foreground-muted)', margin: '0 auto 1.5rem', opacity: 0.3 }} />
            <h3 className="title-font" style={{ fontSize: '1.5rem', color: 'white' }}>الكتالوج فارغ حالياً</h3>
            <p style={{ color: 'var(--foreground-muted)', marginTop: '0.5rem' }}>قم بإنشاء منتجك الأول لتبدأ البيع</p>
          </div>
        ) : (
          <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }} dir="rtl">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th style={{ padding: '1.5rem 1rem', color: 'var(--foreground-muted)', fontWeight: 600, fontSize: '0.9rem' }}>صورة المنتج</th>
                <th style={{ padding: '1.5rem 1rem', color: 'var(--foreground-muted)', fontWeight: 600, fontSize: '0.9rem' }}>اسم المنتج وتفاصيله</th>
                <th style={{ padding: '1.5rem 1rem', color: 'var(--foreground-muted)', fontWeight: 600, fontSize: '0.9rem' }}>التصنيف</th>
                <th style={{ padding: '1.5rem 1rem', color: 'var(--foreground-muted)', fontWeight: 600, fontSize: '0.9rem' }}>السعر</th>
                <th style={{ padding: '1.5rem 1rem', color: 'var(--foreground-muted)', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>إدارة وتعديل</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s', backgroundColor: 'transparent' }}>
                  
                  {/* Image */}
                  <td style={{ padding: '1.5rem 1rem', verticalAlign: 'middle', width: '90px' }}>
                    {prod.image ? (
                      <img src={prod.image} alt={prod.nameAr} style={{ width: '4rem', height: '4rem', borderRadius: '1rem', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.05)' }} />
                    ) : (
                      <div style={{ width: '4rem', height: '4rem', borderRadius: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground-muted)' }}>
                        <ImageIcon size={24} opacity={0.5} />
                      </div>
                    )}
                  </td>

                  {/* Name and Basic details */}
                  <td style={{ padding: '1.5rem 1rem', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>{prod.nameAr}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }} dir="ltr">
                        {prod.nameFr} 
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ padding: '1.5rem 1rem', verticalAlign: 'middle' }}>
                    <span style={{ 
                      backgroundColor: 'rgba(99, 102, 241, 0.1)', 
                      color: '#818cf8', 
                      padding: '0.4rem 0.8rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold', 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      border: '1px solid rgba(99, 102, 241, 0.2)' 
                    }}>
                      <Tag size={12} /> {prod.category?.nameAr || 'غير محدد'}
                    </span>
                  </td>

                  {/* Price */}
                  <td style={{ padding: '1.5rem 1rem', verticalAlign: 'middle' }}>
                     <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'white', display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '1rem' }}>
                        {Number(prod.price).toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#e879f9' }}>د.ج</span>
                     </span>
                  </td>

                  {/* Actions (Edit / Keys / Delete) */}
                  <td style={{ padding: '1.5rem 1rem', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                      
                      {/* Edit Button (Takes to edit page which now contains the Keys manager) */}
                      <Link 
                        href={`/admin/products/edit?id=${prod.id}`}
                        title="تعديل وشحن المخزون الأكواد"
                        style={{ padding: '0.8rem 1.2rem', backgroundColor: '#60a5fa', color: 'black', fontWeight: 'bold', fontSize: '0.9rem', borderRadius: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(96, 165, 250, 0.2)' }}
                      >
                         <PencilLine size={18} /> وتعديل / وإدارة السيريالات
                      </Link>

                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDelete(prod.id)} 
                        title="حذف المنتج نهائياً"
                        style={{ padding: '0.8rem', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                      >
                        <Trash2 size={20} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
