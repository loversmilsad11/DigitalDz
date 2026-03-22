'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { registerUser } from '@/lib/actions';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowLeft, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
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
      router.push(`/login?success=1`);
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
      
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', zIndex: 10 }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass-morphism"
          style={{ width: '100%', maxWidth: '500px', padding: '3rem', borderRadius: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 className="title-font gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              إنشاء حساب
            </h1>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>
              انضم إلى مجتمع ديجيتال ديزاد الآن
            </p>
          </div>
          
          {error && (
            <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fb7185', padding: '1rem', borderRadius: '1rem', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
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
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem 3rem 1rem 1rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', fontSize: '1rem', outline: 'none' }}
                  placeholder="بلال كربوع"
                />
              </div>
            </div>

            <div>
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
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem 3rem 1rem 1rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', fontSize: '1rem', outline: 'none' }}
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
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
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem 3rem 1rem 1rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', fontSize: '1rem', outline: 'none' }}
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              style={{ background: 'var(--primary)', color: 'white', padding: '1.2rem', borderRadius: '1rem', fontWeight: 700, fontSize: '1.05rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '1rem', boxShadow: '0 4px 15px var(--primary-glow)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            >
              {loading ? 'جاري التحميل...' : 'إنشاء حساب'}
              {!loading && <ArrowLeft size={18} />}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', paddingTop: '1.5rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              لديك حساب بالفعل؟ <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', marginRight: '0.5rem' }}>تسجيل الدخول</Link>
            </p>
            <div style={{ opacity: 0.5 }}>
               <p style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>باستخدام هذه المنصة، أنت تؤكد أنك مقيم في الجزائر.</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
