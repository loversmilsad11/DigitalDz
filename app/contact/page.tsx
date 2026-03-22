'use client';
import Navbar from '@/components/Navbar';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/Animations';
import { Mail, Phone, MessageCircle, MapPin, Send, MessageSquare, Clock, Globe } from 'lucide-react';

export default function ContactPage() {
  const contactMethods = [
    {
      icon: <MessageCircle size={32} />,
      title: 'واتساب و تليجرام',
      value: '+213 555 123 456',
      desc: 'الدعم الفني السريع للطلبات والاستفسارات',
      color: '#22c55e',
      link: 'https://wa.me/213555123456'
    },
    {
      icon: <Mail size={32} />,
      title: 'البريد الإلكتروني',
      value: 'support@digitaldz.com',
      desc: 'للمقترحات والتعاون التجاري والشكاوي',
      color: '#e879f9',
      link: 'mailto:support@digitaldz.com'
    },
    {
      icon: <MessageSquare size={32} />,
      title: 'فيسبوك مسنجر',
      value: 'DigitalDZ FB',
      desc: 'تواصل معنا عبر صفحتنا الرسمية على فيسبوك',
      color: '#3b82f6',
      link: '#'
    }
  ];

  const infoItems = [
    { icon: <Clock size={18} />, text: 'متواجدون 24/7 للرد على استفساراتكم' },
    { icon: <Globe size={18} />, text: 'تغطية كاملة لجميع ولايات الوطن' },
    { icon: <MapPin size={18} />, text: 'الجزائر العاصمة، الجزائر' }
  ];

  return (
    <div className="fade-in">
      <Navbar />
      
      <div className="container" style={{ padding: '4rem 2rem 8rem' }}>
        {/* Header Section */}
        <section style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <FadeIn>
            <span className="glass-morphism" style={{ 
              padding: '0.6rem 1.5rem', 
              borderRadius: '2.5rem', 
              fontSize: '0.9rem', 
              color: 'var(--primary)',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '3px',
              marginBottom: '1.5rem',
              display: 'inline-block',
              border: '1px solid var(--primary)'
            }}>
              مركز المساعدة
            </span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="title-font gradient-text" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1 }}>
              نحن هنا لمساعدتكم
            </h1>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p style={{ fontSize: '1.25rem', color: 'var(--foreground-muted)', maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>
              هل لديكم أي استفسار حول طلباتكم أو المنتجات؟ لا تترددوا في التواصل معنا عبر قنواتنا الرسمية.
            </p>
          </FadeIn>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {/* Contact Form Look-alike (or info card) */}
          <FadeIn delay={0.6}>
            <div className="glass-morphism" style={{ padding: '3rem', borderRadius: '2.5rem', border: '1px solid var(--glass-border)', height: '100%' }}>
              <h2 className="title-font" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Send size={24} style={{ color: 'var(--primary)' }} />
                أرسل لنا رسالة
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>الاسم الكامل</label>
                  <input type="text" placeholder="مثال: أحمد محمد" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>عنوان البريد الإلكتروني</label>
                  <input type="email" placeholder="example@mail.com" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>الموضوع</label>
                  <input type="text" placeholder="بخصوص..." style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>الرسالة</label>
                  <textarea placeholder="اكتب رسالتك هنا..." style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} />
                </div>
                <button className="btn-primary" style={{ padding: '1.2rem', borderRadius: '1.25rem', fontSize: '1.1rem', fontWeight: 700, marginTop: '1rem' }}>
                  إرسال الرسالة
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Contact Methods Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <StaggerContainer>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                {contactMethods.map((method, i) => (
                  <StaggerItem key={i}>
                    <a href={method.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                      <div className="glass-morphism contact-card" style={{ 
                        padding: '1.75rem', 
                        borderRadius: '1.75rem', 
                        border: '1px solid var(--glass-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        transition: 'all 0.3s'
                      }}>
                        <div style={{ 
                          width: 64, 
                          height: 64, 
                          borderRadius: '1.25rem', 
                          background: `${method.color}15`, 
                          color: method.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {method.icon}
                        </div>
                        <div>
                          <h3 className="title-font" style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.2rem' }}>{method.title}</h3>
                          <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', marginBottom: '0.1rem' }}>{method.value}</p>
                          <p style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>{method.desc}</p>
                        </div>
                      </div>
                    </a>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>

            {/* Practical Info Card */}
            <FadeIn delay={0.8}>
              <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '1.75rem', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                <h4 className="title-font" style={{ marginBottom: '1.5rem', fontSize: '1.1rem', opacity: 0.8 }}>معلومات إضافية</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {infoItems.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>
                      <div style={{ color: 'var(--primary)' }}>{item.icon}</div>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
      
      <style>{`
        .contact-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary) !important;
          box-shadow: 0 10px 30px -10px var(--primary-glow);
        }
      `}</style>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '1rem 1.2rem',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '1.25rem',
  color: 'white',
  fontFamily: 'var(--font-inter)',
  outline: 'none',
  transition: 'all 0.2s',
  fontSize: '1rem'
};
