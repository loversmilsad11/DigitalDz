'use client';
import { useState, useTransition } from 'react';
import { addReview } from '@/lib/user-actions';
import { Star, Send, User } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: { name: string | null; image: string | null };
}

function StarRating({ value, onChange, readonly }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {[1,2,3,4,5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{ background: 'none', border: 'none', cursor: readonly ? 'default' : 'pointer', padding: 0, transition: 'transform 0.1s' }}
        >
          <Star
            size={readonly ? 16 : 24}
            fill={(hover || value) >= star ? '#fbbf24' : 'transparent'}
            style={{ color: (hover || value) >= star ? '#fbbf24' : 'rgba(255,255,255,0.2)', transition: 'all 0.15s' }}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({
  productId,
  initialReviews,
  isLoggedIn,
  hasBought,
}: {
  productId: string;
  initialReviews: Review[];
  isLoggedIn: boolean;
  hasBought: boolean;
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await addReview(productId, rating, comment);
      if (res.error) { setMsg('❌ ' + res.error); return; }
      setMsg('✓ شكراً! تم حفظ تقييمك');
      setComment('');
      // re-fetch or just show message
      setTimeout(() => setMsg(''), 4000);
    });
  };

  return (
    <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <h2 className="title-font" style={{ fontSize: '1.75rem', fontWeight: 800 }}>آراء العملاء</h2>
        {reviews.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <StarRating value={Math.round(avgRating)} readonly/>
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{avgRating.toFixed(1)}</span>
            <span style={{ color: 'var(--foreground-muted)', fontSize: '0.85rem' }}>({reviews.length} تقييم)</span>
          </div>
        )}
      </div>

      {/* Form */}
      {isLoggedIn && hasBought && (
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', borderRadius: '1.5rem', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem' }}>تقييمك</p>
            <StarRating value={rating} onChange={setRating}/>
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="اكتب رأيك عن هذا المنتج... (اختياري)"
            rows={3}
            style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '0.75rem 1rem', color: 'white', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', marginBottom: '1rem' }}
          />
          {msg && <div style={{ padding: '0.6rem 1rem', borderRadius: '0.75rem', marginBottom: '1rem', fontWeight: 700, fontSize: '0.85rem', background: msg.startsWith('✓') ? 'rgba(34,197,94,0.12)' : 'rgba(244,63,94,0.12)', color: msg.startsWith('✓') ? '#22c55e' : '#f43f5e' }}>{msg}</div>}
          <button type="submit" disabled={isPending} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem', borderRadius: '1rem', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', opacity: isPending ? 0.7 : 1 }}>
            <Send size={15}/> {isPending ? 'جار الحفظ...' : 'إرسال التقييم'}
          </button>
        </form>
      )}
      {isLoggedIn && !hasBought && (
        <div style={{ padding: '1.25rem', borderRadius: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '2rem', color: 'var(--foreground-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
          يمكنك التقييم فقط بعد شراء هذا المنتج
        </div>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--foreground-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '1.5rem', border: '1px dashed rgba(255,255,255,0.08)' }}>
          <Star size={36} style={{ opacity: 0.2, marginBottom: '0.5rem' }}/><br/>
          لا توجد تقييمات بعد. كن أول من يقيّم!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map(r => (
            <div key={r.id} className="glass-morphism" style={{ padding: '1.25rem 1.5rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {r.user.image ? <img src={r.user.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <User size={16} style={{ color: 'var(--primary)' }}/>}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.user.name || 'مجهول'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>{new Date(r.createdAt).toLocaleDateString('ar-DZ')}</div>
                </div>
                <div style={{ marginInlineStart: 'auto' }}>
                  <StarRating value={r.rating} readonly/>
                </div>
              </div>
              {r.comment && <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
