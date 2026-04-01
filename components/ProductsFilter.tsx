'use client';
import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';

interface Product {
  id: string;
  nameAr: string;
  nameFr: string;
  descriptionAr: string;
  price: number;
  slug: string;
  image?: string | null;
  category: { id: string; nameAr: string; nameFr: string };
}

interface Category {
  id: string;
  nameAr: string;
}

interface Props {
  products: Product[];
  categories: Category[];
}

export default function ProductsFilter({ products, categories }: Props) {
  const [search, setSearch]         = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [minPrice, setMinPrice]     = useState('');
  const [maxPrice, setMaxPrice]     = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const maxProductPrice = useMemo(() =>
    Math.max(...products.map(p => p.price), 0), [products]);

  const filtered = useMemo(() => {
    setCurrentPage(1); // Reset to first page when filtering
    return products.filter(p => {
      const matchSearch = !search ||
        p.nameAr.toLowerCase().includes(search.toLowerCase()) ||
        p.nameFr.toLowerCase().includes(search.toLowerCase()) ||
        p.descriptionAr.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === 'all' || p.category?.id === selectedCat;
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Infinity;
      const matchPrice = p.price >= min && p.price <= max;
      return matchSearch && matchCat && matchPrice;
    });
  }, [products, search, selectedCat, minPrice, maxPrice]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const slicedProducts = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const clearFilters = () => {
    setSearch('');
    setSelectedCat('all');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
  };

  const hasActiveFilters = search || selectedCat !== 'all' || minPrice || maxPrice;

  return (
    <>
      {/* Search + Filter Toggle */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '1rem', padding: '0.75rem 2.75rem 0.75rem 1rem',
              color: 'white', fontSize: '0.95rem', outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
            onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--foreground-muted)', cursor: 'pointer', padding: 0 }}>
              <X size={14}/>
            </button>
          )}
        </div>

        <button onClick={() => setShowFilters(v => !v)} style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.75rem 1.25rem', borderRadius: '1rem',
          background: showFilters ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${showFilters ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.1)'}`,
          color: showFilters ? 'var(--primary)' : 'var(--foreground-muted)', cursor: 'pointer',
          fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s',
        }}>
          <SlidersHorizontal size={16}/> فلترة
          {hasActiveFilters && <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900 }}>!</span>}
        </button>

        {hasActiveFilters && (
          <button onClick={clearFilters} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.75rem 1rem', borderRadius: '1rem', border: '1px solid rgba(244,63,94,0.3)',
            background: 'rgba(244,63,94,0.08)', color: '#f43f5e', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
          }}>
            <X size={14}/> مسح
          </button>
        )}
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div style={{ padding: '1.25rem', borderRadius: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-end' }}>
          {/* Price range */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--foreground-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>نطاق السعر (د.ج)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="number" placeholder="من" value={minPrice} onChange={e => setMinPrice(e.target.value)} min={0}
                style={{ width: 90, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.5rem 0.75rem', color: 'white', fontSize: '0.88rem', outline: 'none' }}/>
              <span style={{ color: 'var(--foreground-muted)' }}>—</span>
              <input type="number" placeholder="إلى" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} min={0}
                style={{ width: 90, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.5rem 0.75rem', color: 'white', fontSize: '0.88rem', outline: 'none' }}/>
            </div>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button onClick={() => setSelectedCat('all')} style={{
          padding: '0.55rem 1.25rem', borderRadius: '2rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
          border: selectedCat === 'all' ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
          background: selectedCat === 'all' ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
          color: selectedCat === 'all' ? '#fff' : 'var(--foreground-muted)', transition: 'all 0.2s', whiteSpace: 'nowrap',
        }}>
          الكل ({products.length})
        </button>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setSelectedCat(cat.id)} style={{
            padding: '0.55rem 1.25rem', borderRadius: '2rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
            border: selectedCat === cat.id ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
            background: selectedCat === cat.id ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
            color: selectedCat === cat.id ? '#fff' : 'var(--foreground-muted)', transition: 'all 0.2s', whiteSpace: 'nowrap',
          }}>
            {cat.nameAr} ({products.filter(p => p.category?.id === cat.id).length})
          </button>
        ))}
      </div>

      {/* Results count */}
      {hasActiveFilters && (
        <p style={{ color: 'var(--foreground-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          تم العثور على <strong style={{ color: 'var(--primary)' }}>{filtered.length}</strong> منتج
          {search && <> عن "<strong style={{ color: 'white' }}>{search}</strong>"</>}
        </p>
      )}

      {/* Products grid */}
      {slicedProducts.length === 0 ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--foreground-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '2rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <Search size={48} style={{ opacity: 0.2, marginBottom: '1rem' }}/>
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>لا توجد منتجات تطابق بحثك</p>
          <button onClick={clearFilters} style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', borderRadius: '1rem', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: 'var(--primary)', cursor: 'pointer', fontWeight: 700 }}>
            مسح الفلاتر
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {slicedProducts.map(p => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.nameAr}
                description={p.descriptionAr}
                price={p.price}
                slug={p.slug}
                image={p.image || undefined}
                currency="د.ج"
                addToCartLabel="أضف إلى السلة"
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '4rem' }}>
              <button 
                onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                disabled={currentPage === 1}
                style={{ padding: '0.6rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: currentPage === 1 ? 'default' : 'pointer', opacity: currentPage === 1 ? 0.3 : 1, transition: 'all 0.2s' }}
              >
                السابق
              </button>
              
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  // Show limit pages if too many
                  if (totalPages > 7) {
                    if (pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 1) {
                      if (pageNum === 2 || pageNum === totalPages - 1) return <span key={pageNum} style={{ color: 'var(--foreground-muted)' }}>...</span>;
                      return null;
                    }
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => { setCurrentPage(pageNum); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                      style={{
                        width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem',
                        background: currentPage === pageNum ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                        color: currentPage === pageNum ? 'white' : 'var(--foreground-muted)',
                        transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                disabled={currentPage === totalPages}
                style={{ padding: '0.6rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: currentPage === totalPages ? 'default' : 'pointer', opacity: currentPage === totalPages ? 0.3 : 1, transition: 'all 0.2s' }}
              >
                التالي
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
