'use client';
import { use, useState, useEffect } from 'react';
import { createCategory, deleteCategory, getCategories } from '@/lib/admin-actions';
import { Tag, Trash2, Plus, Loader2 } from 'lucide-react';

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function handleCreate(formData: FormData) {
    setSubmitting(true);
    setError('');
    const res = await createCategory(formData);
    if (res.error) {
      setError(res.error);
    } else {
      await fetchCategories();
      (document.getElementById('category-form') as HTMLFormElement).reset();
    }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا التصنيف؟')) return;
    setLoading(true);
    await deleteCategory(id);
    await fetchCategories();
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="title-font" style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Tag style={{ color: '#34d399' }} /> إدارة التصنيفات
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Form */}
        <div className="glass-morphism" style={{ padding: '1.5rem', borderRadius: '1.5rem', height: 'fit-content', position: 'sticky', top: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>إضافة تصنيف جديد</h2>
          
          {error && (
            <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.2)', color: '#fda4af', padding: '1rem', borderRadius: '0.75rem', fontSize: '0.875rem', marginBottom: '1rem', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              {error}
            </div>
          )}

          <form id="category-form" action={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>اسم التصنيف (بالعربية)</label>
              <input name="nameAr" required style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.75rem', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#34d399'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} placeholder="ألعاب الكمبيوتر..." />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>اسم التصنيف (بالفرنسية)</label>
              <input name="nameFr" required style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.75rem', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#34d399'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} placeholder="Jeux PC..." />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>رابط URL (الاسم اللطيف Slug)</label>
              <input name="slug" required style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.75rem', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#34d399'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} placeholder="pc-games" dir="ltr" />
            </div>
            <button disabled={submitting} type="submit" style={{ width: '100%', backgroundColor: '#059669', color: 'white', fontWeight: 'bold', padding: '0.75rem', borderRadius: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, transition: 'background-color 0.2s' }}>
              {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> إضافة التصنيف</>}
            </button>
          </form>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', gridColumn: 'span 2 / span 2' }}>
          {loading ? (
             <div className="glass-morphism" style={{ padding: '2.5rem', borderRadius: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <Loader2 className="animate-spin" size={32} style={{ color: '#34d399' }} />
             </div>
          ) : categories.length === 0 ? (
            <div className="glass-morphism" style={{ padding: '2.5rem', borderRadius: '1.5rem', textAlign: 'center', color: 'var(--foreground-muted)' }}>
              لا توجد تصنيفات حالياً. قم بإضافة تصنيف من القائمة الجانبية.
            </div>
          ) : (
            categories.map(cat => (
              <div key={cat.id} className="glass-morphism" style={{ padding: '1.25rem', borderRadius: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', margin: 0 }}>{cat.nameAr} <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: 'var(--foreground-muted)', marginLeft: '0.5rem' }}>/ {cat.nameFr}</span></h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--foreground-muted)', backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', display: 'inline-block', marginTop: '0.5rem', fontFamily: 'monospace' }}>/{cat.slug}</p>
                </div>
                <button onClick={() => handleDelete(cat.id)} style={{ padding: '0.75rem', color: '#fb7185', backgroundColor: 'transparent', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(244,63,94,0.2)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
