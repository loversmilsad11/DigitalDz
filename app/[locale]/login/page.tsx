'use client';
import { useTranslations } from 'next-intl';
import { use, useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

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
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      setLoading(false);
    } else {
      router.push(`/${params.locale}/`);
      router.refresh();
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--surface)', position: 'relative', overflowX: 'hidden' }}>
      <div style={{ width: '100%', position: 'relative', zIndex: 50 }}>
        <Navbar />
      </div>
      
      {/* Dynamic Background Elements */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="glow"
        style={{ top: '10%', right: '20%', background: 'rgba(99, 102, 241, 0.4)' }}
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="glow"
        style={{ bottom: '10%', left: '20%', background: 'rgba(244, 63, 94, 0.3)' }}
      />
      
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', zIndex: 10 }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }}
          className="glass-morphism"
          style={{ width: '100%', maxWidth: '440px', padding: '3rem', borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="title-font gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                {t('signIn')}
              </h1>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>
                مرحباً بك مجدداً في متجر ديجيتال ديزاد
              </p>
            </motion.div>
          </div>

          {success && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.9 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '1rem', borderRadius: '1rem', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <CheckCircle2 size={18} /> تم إنشاء الحساب بنجاح!
            </motion.div>
          )}
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.9 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fb7185', padding: '1rem', borderRadius: '1rem', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <AlertCircle size={18} /> {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem', marginRight: '0.25rem' }}>
                البريد الإلكتروني
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '1rem', color: 'var(--foreground-muted)' }}>
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem 3rem 1rem 1rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', fontSize: '1rem', outline: 'none', transition: 'all 0.3s' }}
                  placeholder="name@example.com"
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'rgba(255,255,255,0.06)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.background = 'rgba(255, 255, 255, 0.03)' }}
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem', marginRight: '0.25rem' }}>
                كلمة المرور
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '1rem', color: 'var(--foreground-muted)' }}>
                  <Lock size={20} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem 3rem 1rem 1rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', fontSize: '1rem', outline: 'none', transition: 'all 0.3s' }}
                  placeholder="••••••••"
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'rgba(255,255,255,0.06)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.background = 'rgba(255, 255, 255, 0.03)' }}
                />
              </div>
            </motion.div>
            
            <motion.button 
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{ background: 'var(--primary)', color: 'white', padding: '1.2rem', borderRadius: '1rem', fontWeight: 700, fontSize: '1.05rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '1rem', boxShadow: '0 4px 15px var(--primary-glow)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'box-shadow 0.3s' }}
            >
              {loading ? 'جاري التحميل...' : t('signIn')}
              {!loading && <ArrowLeft size={18} />}
            </motion.button>
          </form>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{ textAlign: 'center', paddingTop: '1.5rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem', marginLeft: '0.5rem' }}>ليس لديك حساب؟</span>
            <Link href={`/${params.locale}/register`} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}>
              إنشاء حساب جديد
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
