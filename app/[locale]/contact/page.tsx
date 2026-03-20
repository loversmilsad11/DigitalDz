import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';

export default async function ContactPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const nt = await getTranslations('Navbar');
  const catT = await getTranslations('Categories');

  return (
    <div className="fade-in">
      <Navbar />
      <div className="container" style={{ padding: '6rem 0' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h1 className="title-font gradient-text" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 900 }}>
            {nt('contact')}
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--foreground-muted)', marginBottom: '4rem' }}>
            نحن هنا لمساعدتكم في أي وقت. تواصلوا معنا عبر القنوات التالية.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', textAlign: 'left' }}>
             <div className="glass-morphism" style={{ padding: '2.5rem', borderRadius: '2rem' }}>
                <h3 className="title-font" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>📱 Messenger & WhatsApp</h3>
                <p style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem' }}>Support Algerie: +213 555 12 34 56</p>
                <p style={{ color: 'var(--foreground-muted)' }}>متاحون على مدار الساعة للرد على استفساراتكم.</p>
             </div>
             
             <div className="glass-morphism" style={{ padding: '2.5rem', borderRadius: '2rem' }}>
                <h3 className="title-font" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>📧 Email Support</h3>
                <p style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem' }}>support@digitaldz.com</p>
                <p style={{ color: 'var(--foreground-muted)' }}>للشكاوي والاقتراحات التجارية والتعاون.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
