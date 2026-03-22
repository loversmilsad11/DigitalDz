'use client';
import Navbar from '@/components/Navbar';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/Animations';
import { ShieldCheck, Zap, Heart, Users, Target, Rocket } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <ShieldCheck size={32} />,
      title: 'أمان تام',
      desc: 'نضمن لك أماناً كاملاً في جميع معاملاتك المالية وحماية بياناتك الشخصية بأحدث التقنيات.'
    },
    {
      icon: <Zap size={32} />,
      title: 'توصيل فوري',
      desc: 'لا حاجة للانتظار، بنقرة واحدة ستحصل على مفتاحك الرقمي أو اشتراكك في ثوانٍ معدودة.'
    },
    {
      icon: <Heart size={32} />,
      title: 'دعم تقني متواصل',
      desc: 'فريقنا متاح دائماً للإجابة على استفساراتكم ومساعدتكم في تفعيل خدماتكم والرد على تساؤلاتكم.'
    }
  ];

  return (
    <div className="fade-in">
      <Navbar />
      
      <div className="container" style={{ padding: '6rem 2rem 10rem' }}>
        {/* Hero Section */}
        <section style={{ textAlign: 'center', marginBottom: '8rem' }}>
          <FadeIn>
            <span className="glass-morphism" style={{ 
              padding: '0.6rem 1.5rem', 
              borderRadius: '2.5rem', 
              fontSize: '0.9rem', 
              color: 'var(--primary)',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '3px',
              marginBottom: '2rem',
              display: 'inline-block',
              border: '1px solid var(--primary)'
            }}>
              قصتنا ورؤيتنا
            </span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="title-font gradient-text" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, marginBottom: '2rem', lineHeight: 1.1 }}>
              رائدون في عالم المنتجات الرقمية في الجزائر
            </h1>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p style={{ fontSize: '1.25rem', color: 'var(--foreground-muted)', maxWidth: 850, margin: '0 auto', lineHeight: 1.8 }}>
               ديجيتال دي زاد (DigitalDZ) هو ثمرة طموح شباب جزائري يسعى لتسهيل الوصول إلى الخدمات الرقمية العالمية، وتوفير تجربة شراء آمنة وسلسة تناسب احتياجات السوق المحلي.
            </p>
          </FadeIn>
        </section>

        {/* Mission & Vision Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', marginBottom: '8rem' }}>
          <ScaleIn>
            <div className="glass-morphism" style={{ padding: '3.5rem', borderRadius: '3rem', border: '1px solid var(--glass-border)', height: '100%', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'var(--primary)', opacity: 0.1, filter: 'blur(50px)', borderRadius: '50%' }} />
              <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '1.25rem', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                <Target size={32} />
              </div>
              <h2 className="title-font" style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>مهمتنا</h2>
              <p style={{ fontSize: '1.15rem', color: '#cbd5e1', lineHeight: 1.8 }}>
                تسهيل الوصول إلى المحتوى الرقمي والخدمات العالمية لجميع الجزائريين من خلال توفير حلول دفع محلية (بريد مـوب، CIB، CCP) وضمان توصيل فوري يعتمد عليه.
              </p>
            </div>
          </ScaleIn>

          <ScaleIn delay={0.2}>
            <div className="glass-morphism" style={{ padding: '3.5rem', borderRadius: '3rem', border: '1px solid var(--glass-border)', height: '100%', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '150px', height: '150px', background: '#e879f9', opacity: 0.1, filter: 'blur(50px)', borderRadius: '50%' }} />
              <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '1.25rem', background: 'rgba(232,121,249,0.1)', color: '#e879f9', marginBottom: '1.5rem' }}>
                <Rocket size={32} />
              </div>
              <h2 className="title-font" style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>رؤيتنا</h2>
              <p style={{ fontSize: '1.15rem', color: '#cbd5e1', lineHeight: 1.8 }}>
                أن نكون المتجر الرقمي الأول في الجزائر وشمال أفريقيا، نساهم في تعزيز الاقتصاد الرقمي وتوفير تجربة تسوق عالمية بمعايير محلية.
              </p>
            </div>
          </ScaleIn>
        </div>

        {/* Values Section */}
        <section>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 className="title-font" style={{ fontSize: '2.5rem', fontWeight: 800 }}>لماذا ديجيتال دي زاد؟</h2>
              <div style={{ width: 60, height: 4, background: 'var(--primary)', margin: '1rem auto', borderRadius: '2px' }} />
            </div>
          </FadeIn>

          <StaggerContainer>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
              {values.map((value, i) => (
                <StaggerItem key={i}>
                  <div className="glass-morphism" style={{ padding: '2.5rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', transition: 'transform 0.3s' }} onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-10px)')} onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                    <div style={{ width: 80, height: 80, borderRadius: '2rem', background: 'rgba(255,255,255,0.03)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                      {value.icon}
                    </div>
                    <h3 className="title-font" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>{value.title}</h3>
                    <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.6 }}>{value.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </section>

        {/* Team/Stat Section */}
        <section style={{ marginTop: '10rem', textAlign: 'center' }}>
          <FadeIn>
            <div className="glass-morphism" style={{ padding: '5rem 3rem', borderRadius: '4rem', border: '1px solid var(--glass-border)', background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(232,121,249,0.05))' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem' }}>
                <div>
                   <h3 className="title-font gradient-text" style={{ fontSize: '3.5rem', fontWeight: 900 }}>+500</h3>
                   <p style={{ color: 'var(--foreground-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>منتج رقمي متوفر</p>
                </div>
                <div>
                   <h3 className="title-font gradient-text" style={{ fontSize: '3.5rem', fontWeight: 900 }}>+10K</h3>
                   <p style={{ color: 'var(--foreground-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>عميل راضٍ في الجزائر</p>
                </div>
                <div>
                   <h3 className="title-font gradient-text" style={{ fontSize: '3.5rem', fontWeight: 900 }}>24/7</h3>
                   <p style={{ color: 'var(--foreground-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>دعم فني متواصل</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>
      </div>
    </div>
  );
}
