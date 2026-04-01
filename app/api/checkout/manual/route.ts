import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'يرجى تسجيل الدخول أولاً' }, { status: 401 });
    }

    const body = await req.json();
    const { items, paymentMethod, paymentId, name, phone, email, couponCode } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'السلة فارغة' }, { status: 400 });
    }

    if (!paymentId) {
      return NextResponse.json({ error: 'رقم المعاملة / الوصل مطلوب' }, { status: 400 });
    }

    // Get user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    // Calculate subtotal from DB to be safe
    let subtotal = 0;
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: items.map((i: any) => i.productId) } }
    });

    for (const item of items) {
      const product = dbProducts.find(p => p.id === item.productId);
      if (product) {
        subtotal += Number(product.price) * item.quantity;
      }
    }

    // Handle Coupon
    let discountAmount = 0;
    let appliedCouponCode = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase(), isActive: true }
      });

      if (coupon) {
        // Simple validation
        const notExpired = !coupon.expiresAt || coupon.expiresAt > new Date();
        const underLimit = !coupon.maxUses || coupon.usedCount < coupon.maxUses;

        if (notExpired && underLimit) {
          discountAmount = coupon.type === 'PERCENT'
            ? (subtotal * Number(coupon.discount)) / 100
            : Number(coupon.discount);
          
          discountAmount = Math.min(discountAmount, subtotal);
          appliedCouponCode = coupon.code;

          // Increment coupon usage
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } }
          });
        }
      }
    }

    const finalTotal = subtotal - discountAmount;

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: finalTotal,
        discount: discountAmount,
        couponCode: appliedCouponCode,
        status: 'PENDING',
        paymentMethod,
        paymentId,
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        items: {
          create: items.map((item: any) => {
            const product = dbProducts.find(p => p.id === item.productId);
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product ? product.price : 0
            };
          })
        }
      }
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error('Manual checkout error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء معالجة الطلب' }, { status: 500 });
  }
}
