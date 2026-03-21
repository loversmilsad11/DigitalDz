'use client';
import { use, useState, useEffect, useRef } from 'react';
import { createCategory, deleteCategory, getCategories, updateCategory } from '@/lib/admin-actions';
import { Tag, Trash2, Plus, Loader2, Edit2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CategoriesAdminPage(props: { params: Promise<{ locale: string }> }) {
  const params = use(props.params);
  const t = useTranslations('Admin');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);
  const isRtl = params.locale === 'ar';

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

  async function handleAction(formData: FormData) {
    setSubmitting(true);
    setError('');
    
    let res;
    if (editingCategory) {
      res = await updateCategory(editingCategory.id, formData);
    } else {
      res = await createCategory(formData);
    }

    if (res.error) {
      setError(res.error);
    } else {
      await fetchCategories();
      formRef.current?.reset();
      setEditingCategory(null);
    }
    setSubmitting(false);
  }

  function startEditing(cat: any) {
    setEditingCategory(cat);
    // Use a small timeout to ensure form fields are updated if we were using controlled inputs, 
    // but here we use uncontrolled with reset/ref. 
    // Since we want to populate the form, we can either use state for inputs or manually set values.
    // Let's use controlled inputs for better UX during editing.
  }

  // To make editing easier, let's use state for the form fields
  const [formDataState, setFormDataState] = useState({
    nameAr: '',
    nameFr: '',
    slug: ''
  });

  useEffect(() => {
    if (editingCategory) {
      setFormDataState({
        nameAr: editingCategory.nameAr,
        nameFr: editingCategory.nameFr,
        slug: editingCategory.slug
      });
    } else {
      setFormDataState({ nameAr: '', nameFr: '', slug: '' });
    }
  }, [editingCategory]);

  async function handleDelete(id: string) {
    if (!confirm(t('confirmDelete'))) return;
    setLoading(true);
    await deleteCategory(id);
    await fetchCategories();
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="title-font" style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Tag style={{ color: '#34d399' }} /> {t('categories')}
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Form */}
        <div className="glass-morphism" style={{ padding: '1.5rem', borderRadius: '1.5rem', height: 'fit-content', border: '1px solid var(--glass-border)', position: 'sticky', top: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
              {editingCategory ? t('editProduct') : t('addCategory')}
            </h2>
            {editingCategory && (
              <button 
                onClick={() => setEditingCategory(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--foreground-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            )}
          </div>
          
          {error && (
            <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.2)', color: '#fda4af', padding: '1rem', borderRadius: '0.75rem', fontSize: '0.875rem', marginBottom: '1rem', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              {error}
            </div>
          )}

          <form 
            ref={formRef} 
            action={handleAction} 
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--foreground-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>{t('categoryNameAr')}</label>
              <input 
                name="nameAr" 
                required 
                value={formDataState.nameAr}
                onChange={e => setFormDataState({...formDataState, nameAr: e.target.value})}
                style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.9rem', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} 
                onFocus={e => e.target.style.borderColor = '#34d399'} 
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} 
                placeholder={t('categoryPlaceholder')} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--foreground-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>{t('categoryNameFr')}</label>
              <input 
                name="nameFr" 
                required 
                value={formDataState.nameFr}
                onChange={e => setFormDataState({...formDataState, nameFr: e.target.value})}
                style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.9rem', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} 
                onFocus={e => e.target.style.borderColor = '#34d399'} 
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} 
                placeholder="Jeux PC..." 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--foreground-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>{t('slug')}</label>
              <input 
                name="slug" 
                required 
                value={formDataState.slug}
                onChange={e => setFormDataState({...formDataState, slug: e.target.value})}
                style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.9rem', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} 
                onFocus={e => e.target.style.borderColor = '#34d399'} 
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} 
                placeholder="pc-games" 
                dir="ltr" 
              />
            </div>
            <button 
              disabled={submitting} 
              type="submit" 
              style={{ width: '100%', backgroundColor: editingCategory ? '#818cf8' : '#10b981', color: 'white', fontWeight: 800, padding: '1rem', borderRadius: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, transition: 'all 0.2s', boxShadow: `0 4px 15px ${editingCategory ? 'rgba(129, 140, 248, 0.2)' : 'rgba(16, 185, 129, 0.2)'}` }}
            >
              {submitting ? <Loader2 className="animate-spin" size={20} /> : (
                <>{editingCategory ? <Edit2 size={20} /> : <Plus size={20} />} {editingCategory ? t('save') : t('save')}</>
              )}
            </button>
          </form>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? (
             <div className="glass-morphism" style={{ padding: '2.5rem', borderRadius: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--glass-border)' }}>
               <Loader2 className="animate-spin" size={32} style={{ color: '#34d399' }} />
             </div>
          ) : categories.length === 0 ? (
            <div className="glass-morphism" style={{ padding: '2.5rem', borderRadius: '1.5rem', textAlign: 'center', color: 'var(--foreground-muted)', border: '1px dashed var(--glass-border)' }}>
              {t('noCategories')}
            </div>
          ) : (
            categories.map(cat => (
              <div key={cat.id} className="glass-morphism" style={{ padding: '1.25rem', borderRadius: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s', border: editingCategory?.id === cat.id ? '1px solid #818cf8' : '1px solid var(--glass-border)', boxShadow: editingCategory?.id === cat.id ? '0 0 15px rgba(129, 140, 248, 0.2)' : 'none' }} onMouseOver={e => !editingCategory && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')} onMouseOut={e => !editingCategory && (e.currentTarget.style.background = 'transparent')}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '1.125rem', margin: 0, color: 'white' }}>{isRtl ? cat.nameAr : cat.nameFr} <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: 'var(--foreground-muted)', marginInlineStart: '0.5rem' }}>/ {isRtl ? cat.nameFr : cat.nameAr}</span></h3>
                  <p style={{ fontSize: '0.75rem', color: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', display: 'inline-block', marginTop: '0.5rem', fontFamily: 'monospace', fontWeight: 600 }}>/{cat.slug}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => startEditing(cat)} 
                    style={{ padding: '0.75rem', color: '#818cf8', backgroundColor: 'rgba(129, 140, 248, 0.05)', border: '1px solid rgba(129, 140, 248, 0.1)', borderRadius: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }} 
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(129, 140, 248, 0.2)'; e.currentTarget.style.borderColor = 'rgba(129, 140, 248, 0.3)'; }} 
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(129, 140, 248, 0.05)'; e.currentTarget.style.borderColor = 'rgba(129, 140, 248, 0.1)'; }}
                  >
                    <Edit2 size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)} 
                    style={{ padding: '0.75rem', color: '#fb7185', backgroundColor: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.1)', borderRadius: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }} 
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.2)'; e.currentTarget.style.borderColor = 'rgba(244,63,94,0.3)'; }} 
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(244, 63, 94, 0.05)'; e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.1)'; }}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
