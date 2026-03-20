'use client';
import { useTranslations } from 'next-intl';
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { registerUser } from '@/lib/actions';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowLeft, AlertCircle } from 'lucide-react';

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--surface)', position: 'relative', overflowX: 'hidden' }}>
      <div style={{ width: '100%', position: 'relative', zIndex: 50 }}>
        <Navbar />
      </div>
      
      {/* Dynamic Background Elements */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="glow"
        style={{ top: '15%', right: '15%', background: 'rgba(99, 102, 241, 0.35)' }}
      />
      <motion.div 
        animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="glow"
        style={{ bottom: '5%', left: '15%', background: 'rgba(244, 63, 94, 0.25)' }}
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="glow"
        style={{ top: '40%', left: '40%', background: 'rgba(56, 189, 248, 0.2)' }}
      />
      
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', zIndex: 10 }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }}
          className="glass-morphism"
          style={{ width: '100%', maxWidth: '500px', padding: '3rem', borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="title-font gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                {t('signUp')}
              </h1>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>
                انضم إلى مجتمع ديجيتال ديزاد الآن
              </p>
            </motion.div>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.9 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fb7185', padding: '1rem', borderRadius: '1rem', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <AlertCircle size={18} /> {error}
            </motion.div>
          )}

          <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem', marginRight: '0.25rem' }}>
                الاسم الكامل
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '1rem', color: 'var(--foreground-muted)' }}>
                  <User size={20} />
                </div>
                <input 
                  name="name"
                  type="text" 
                  required
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem 3rem 1rem 1rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', fontSize: '1rem', outline: 'none', transition: 'all 0.3s' }}
                  placeholder="بلال كربوع"
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
                البريد الإلكتروني
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '1rem', color: 'var(--foreground-muted)' }}>
                  <Mail size={20} />
                </div>
                <input 
                  name="email"
                  type="email" 
                  required
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
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--foreground-muted)', marginBottom: '0.5rem', marginRight: '0.25rem' }}>
                كلمة المرور
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '1rem', color: 'var(--foreground-muted)' }}>
                  <Lock size={20} />
                </div>
                <input 
                  name="password"
                  type="password" 
                  required
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
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{ background: 'var(--primary)', color: 'white', padding: '1.2rem', borderRadius: '1rem', fontWeight: 700, fontSize: '1.05rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '1rem', boxShadow: '0 4px 15px var(--primary-glow)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'box-shadow 0.3s' }}
            >
              {loading ? 'جاري التحميل...' : t('signUp')}
              {!loading && <ArrowLeft size={18} />}
            </motion.button>
          </form>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            style={{ textAlign: 'center', paddingTop: '1.5rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              لديك حساب بالفعل؟ <Link href={`/${params.locale}/login`} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', marginRight: '0.5rem', transition: 'color 0.2s' }}>تسجيل الدخول</Link>
            </p>
            <div style={{ opacity: 0.5 }}>
               <p style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>باستخدام هذه المنصة، أنت تؤكد أنك مقيم في الجزائر.</p>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
