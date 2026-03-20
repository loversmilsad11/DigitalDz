import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const t = await getTranslations('About');

  return (
    <div className="fade-in">
      <Navbar />
      <div className="container" style={{ padding: '6rem 0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h1 className="title-font gradient-text" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 900 }}>
            {t('title')}
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--foreground-muted)', lineHeight: 1.8, marginBottom: '3rem' }}>
            {t('description')}
          </p>

          <div style={{ padding: '3rem', borderRadius: '2rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', boxShadow: 'var(--glass-shadow)', marginBottom: '4rem' }}>
             <h2 className="title-font" style={{ fontSize: '2rem', marginBottom: '1rem' }}>مهمتنا / Notre Mission</h2>
             <p style={{ fontSize: '1.1rem', color: '#fff' }}>{t('mission')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
             <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
                <h3 className="title-font">{t('values.security')}</h3>
             </div>
             <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚀</div>
                <h3 className="title-font">{t('values.speed')}</h3>
             </div>
             <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👩‍💻</div>
                <h3 className="title-font">{t('values.support')}</h3>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
