'use client';
import { useTranslations } from 'next-intl';
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { registerUser } from '@/lib/actions';

export default function RegisterPage(props: { params: Promise<{ locale: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const t = useTranslations('Auth');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    
    const result = await registerUser(formData);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push(`/${params.locale}/login?success=1`);
    }
  }

  return (
    <div className="fade-in min-h-screen flex flex-col bg-surface">
      <Navbar />
      
      <main className="container flex-1 flex items-center justify-center py-12">
        <div className="glass-morphism w-full max-w-lg p-8 sm:p-12 space-y-8" style={{ borderRadius: '2rem' }}>
          <div className="text-center">
            <h1 className="title-font gradient-text text-3xl font-bold mb-2">{t('signUp')}</h1>
            <p className="text-foreground-muted">انضم إلى مجتمع ديجيتال ديزاد الآن</p>
          </div>
          
          {error && (
            <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 p-4 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-2 ps-1">
                  الاسم الكامل
                </label>
                <input 
                  name="name"
                  type="text" 
                  required
                  className="w-full glass-morphism p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary border-none text-white transition-all"
                  placeholder="بلال كربوع"
                />
              </div>

               <div>
                <label className="block text-sm font-medium text-foreground-muted mb-2 ps-1">
                  {t('email')}
                </label>
                <input 
                  name="email"
                  type="email" 
                  required
                  className="w-full glass-morphism p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary border-none text-white transition-all"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-2 ps-1">
                  {t('password')}
                </label>
                <input 
                  name="password"
                  type="password" 
                  required
                  className="w-full glass-morphism p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary border-none text-white transition-all"
                  placeholder="********"
                />
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg font-bold disabled:opacity-50"
              style={{ borderRadius: '1.2rem', marginTop: '2rem', width: '100%' }}
            >
              {loading ? 'جاري التحميل...' : t('signUp')}
            </button>
          </form>
          
          <p className="text-center text-foreground-muted text-sm pb-4">
            لديك حساب بالفعل؟ <Link href={`/${params.locale}/login`} className="text-primary font-bold" style={{ textDecoration: 'none' }}>{t('signIn')}</Link>
          </p>

          <div style={{ textAlign: 'center', opacity: 0.6 }}>
             <p className="text-xs text-foreground-muted">باستخدام هذه المنصة، أنت تؤكد أنك مقيم في الجزائر.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
