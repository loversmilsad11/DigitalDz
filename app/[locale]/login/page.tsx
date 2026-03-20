'use client';
import { useTranslations } from 'next-intl';
import { use, useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function LoginPage(props: { params: Promise<{ locale: string }> }) {
  const params = use(props.params); 
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('Auth');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('success')) {
      setSuccess(true);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push(`/${params.locale}/`);
      router.refresh();
    }
  }

  return (
    <div className="fade-in min-h-screen flex flex-col bg-surface">
      <Navbar />
      
      <main className="container flex-1 flex items-center justify-center py-12">
        <div className="glass-morphism w-full max-w-md p-8 sm:p-12 space-y-8" style={{ borderRadius: '2rem' }}>
          <div className="text-center">
            <h1 className="title-font gradient-text text-3xl font-bold mb-2">{t('signIn')}</h1>
            <p className="text-foreground-muted">مرحباً بك مجدداً في متجر ديجيتال ديزاد</p>
          </div>

          {success && (
            <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 p-4 rounded-xl text-sm text-center">
              تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.
            </div>
          )}
          
          {error && (
            <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 p-4 rounded-xl text-sm text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground-muted mb-2 ps-1">
                {t('email')}
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-morphism p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary border-none text-white transition-all"
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground-muted mb-2 ps-1">
                {t('password')}
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-morphism p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary border-none text-white transition-all"
                placeholder="********"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg font-bold disabled:opacity-50"
              style={{ borderRadius: '1.2rem', marginTop: '1.5rem', width: '100%' }}
            >
              {loading ? 'جاري التحميل...' : t('signIn')}
            </button>
          </form>
          
          <div className="text-center pt-4">
            <span className="text-foreground-muted text-sm ms-2">ليس لديك حساب؟</span>
            <Link href={`/${params.locale}/register`} className="text-primary font-bold text-sm" style={{ textDecoration: 'none' }}>
              {t('signUp')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
